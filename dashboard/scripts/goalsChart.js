import { Goal } from "../../Data/Goal.js";

export async function renderGoalsCanvasChart(userId) {
  const canvas = document.getElementById("goalsChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  // Set real pixel size (fix blur)
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  // Reset transform then scale
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  // Use responsive size
  const chartWidth = rect.width;
  const chartHeight = rect.height;

  // get last 4 goals only
  const allGoals = (Goal.getUserGoals(userId) || []).reverse();
  const goalsToShow = allGoals.slice(-4);

  // If no goals → centered message
  if (!goalsToShow.length) {
    ctx.clearRect(0, 0, chartWidth, chartHeight);

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
  const barWidth = 50;
  const numberOfBars = 4;
  const gap = 50;
  const maxBarHeight = chartHeight - 60;
  const xAxisY = chartHeight - 30;

  // 🔥 Centering calculation
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
    const goal = goalsToShow[i] || null;
    const stats = allStats[i];

    let progress = 0;
    let progressLabel = "";
    let weekLabel = "-";

    if (goal && stats) {
      progress = Math.round(stats.totalProgress || 0);
      progressLabel = `${progress}%`;

      const date = new Date(goal.weekStartDate);
      weekLabel = `${date.getMonth() + 1}/${date.getDate()}`;
    } else if (i === numberOfBars - 1) {
      progressLabel = "No Goal";
    }

    if (i === numberOfBars - 1) weekLabel = "Current Week";

    const x = startX + i * (barWidth + gap);
    const barHeight = (progress / 100) * maxBarHeight;
    const y = xAxisY - barHeight;

    // Bar
    ctx.fillStyle = Goal.getProgressSoftColor(progress);
    ctx.fillRect(x, y, barWidth, barHeight);

    // Labels
    ctx.fillText(progressLabel, x + barWidth / 2, y - 8);
    ctx.fillText(weekLabel, x + barWidth / 2, chartHeight - 10);
  }
}
