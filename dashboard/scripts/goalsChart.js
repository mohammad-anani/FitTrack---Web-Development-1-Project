import { Goal } from "../../Data/Goal.js";

export async function renderGoalsCanvasChart(userId) {
  const canvas = document.getElementById("goalsChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  // Set real pixel size to avoid blurry pixels
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  ctx.scale(dpr, dpr);

  const chartWidth = rect.width;
  const chartHeight = rect.height;

  // Get current + last 3 goals
  const currentGoal = Goal.getCurrentUserGoal(userId);

  let allGoals = (Goal.getUserGoals(userId) || []).reverse();

  if (currentGoal) {
    allGoals = allGoals.filter((g) => g.id !== currentGoal.id);
  }

  const last3Goals = allGoals.slice(-3);
  const goalsToShow = [...last3Goals, currentGoal || null];

  // If no goals at all
  if (goalsToShow.every((g) => !g)) {
    ctx.fillStyle = "#000";
    ctx.font = "bold 25px Lato";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText("No Goals Yet", chartWidth / 2, chartHeight / 2);
    return;
  }

  // Get stats in parallel
  const statsPromises = goalsToShow.map((goal) =>
    goal ? Goal.getGoalStats(goal.id) : Promise.resolve(null),
  );
  const allStats = await Promise.all(statsPromises);

  // Chart config
  const numberOfBars = 4;
  const barWidth = Math.min(50, chartWidth / 10);
  const gap = barWidth;
  const maxBarHeight = chartHeight - 60;
  const xAxisY = chartHeight - 30;

  // Centering
  const totalBarsWidth = numberOfBars * barWidth;
  const totalGapsWidth = (numberOfBars - 1) * gap;
  const chartContentWidth = totalBarsWidth + totalGapsWidth;
  const startX = (chartWidth - chartContentWidth) / 2;

  // Styles
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.font = "14px Lato";
  ctx.textAlign = "center";

  // Y axis
  ctx.beginPath();
  ctx.moveTo(startX - 20, 10);
  ctx.lineTo(startX - 20, xAxisY);
  ctx.stroke();

  // X axis
  ctx.beginPath();
  ctx.moveTo(startX - 20, xAxisY);
  ctx.lineTo(startX + chartContentWidth + 10, xAxisY);
  ctx.stroke();

  // Y-axis label
  ctx.save();
  ctx.translate(startX - 35, chartHeight / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("Progress (%)", 0, 0);
  ctx.restore();

  // X-axis label
  ctx.fillText("Week", chartWidth / 2, chartHeight - 5);

  // Draw bars
  for (let i = 0; i < numberOfBars; i++) {
    const goal = goalsToShow[i];
    const stats = allStats[i];

    let progress = 0;
    let progressLabel = "";
    let weekLabel = "-";

    if (goal && stats) {
      progress = Math.round(stats.totalProgress || 0);
      progressLabel = `${progress}%`;

      const date = new Date(goal.weekStartDate);
      weekLabel = `${date.getMonth() + 1}/${date.getDate()}`;
    }

    // Current slot (last bar)
    if (i === numberOfBars - 1) {
      weekLabel = "Current Week";

      if (!goal) {
        progressLabel = "No Goal";
      }
    }

    const x = startX + i * (barWidth + gap);
    const barHeight = (progress / 100) * maxBarHeight;
    const y = xAxisY - barHeight;

    // Bar color
    if (i === numberOfBars - 1 && !goal) {
      ctx.fillStyle = "#e5e7eb"; // empty current
    } else {
      ctx.fillStyle = Goal.getProgressSoftColor(progress);
    }

    // Rounded bar
    ctx.beginPath();
    ctx.rect(x, y, barWidth, barHeight, 8);
    ctx.fill();

    // Label color (special for missing current)
    if (i === numberOfBars - 1 && !goal) {
      ctx.fillStyle = "#000";
    } else {
      ctx.fillStyle = "#333";
    }

    // Prevent label going too high
    const labelY = Math.max(y - 8, 12);
    ctx.fillText(progressLabel, x + barWidth / 2, labelY);

    // Week label
    ctx.fillStyle = "#333";
    ctx.fillText(weekLabel, x + barWidth / 2, chartHeight - 10);
  }
}
