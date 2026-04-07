import { Goal } from "../../Data/Goal.js";

export async function renderCurrentGoal(currentGoal, currentGoalDiv) {
  const stats = await Goal.getGoalStats(currentGoal.id);

  currentGoalDiv.innerHTML = `
<h2>Current Goal <span>(${currentGoal.weekStartDate})</span></h2>

<!-- Calories Progress Section -->
<div class='current-Goal'>
<div class='progresses'>
<h3><u>Progresses</u></h3>
<div class='progresses-div'>
<div class="progress-div">
  <span>Calories:</span>
  <progress 
    id="caloriesProgress" 
    value="0" 
    max="${stats.calorieGoal}">
  </progress>
  <span id="caloriesText">0/${stats.calorieGoal}</span>
</div>
<!-- Workouts Progress Section -->
<div class="progress-div">
  <span>Workouts:</span>
  <progress 
    id="workoutsProgress" 
    value="0" 
    max="${stats.workoutGoal}">
  </progress>
  <span id="workoutsText">0/${stats.workoutGoal}</span>
</div>
</div>
</div>
<div class='total-div'>
<h3><u>Total Progress</u></h3>

<div class="total-ui-div">
  <span class="total-ui-span">
    <span class="percentage">0</span>%
  </span>
  
  <div class="total-ui-progress">
    <!-- The moving caret/marker -->
    <div class="total-ui-caret">
      <i class="fa-solid fa-caret-down"></i>
      <span class='caret'>|</span>
    </div>
  </div>
  <h3 class='motivational-message'></h3>
</div>
</div>
<div class='reset-div'>
<button class='reset-goal primary'>Reset</button>
</div>
</div>

`;

  // Animate the progress bars from 0 to current value
  animateProgress(
    "caloriesProgress",
    "caloriesText",
    stats.weeklyCalories,
    stats.calorieGoal,
  );
  animateProgress(
    "workoutsProgress",
    "workoutsText",
    stats.weeklyCount,
    stats.workoutGoal,
  );

  // Animate total progress number as before
  await SetProgress(stats.totalProgress, stats.motivationalMessage);

  const resetButton = document.querySelector(".reset-goal");

  resetButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset goal?")) {
      currentGoal.resetGoal();
      window.location.reload();
    }
  });
}
//renders a progress element value and its text from 0 smoothly
function animateProgress(progressId, textId, currentValue, maxValue) {
  const progressElement = document.getElementById(progressId);
  const textElement = document.getElementById(textId);

  const duration = 1000;
  const intervalTime = 20;
  const steps = duration / intervalTime;

  let currentStep = 0;

  const increment = currentValue / steps;

  const interval = setInterval(() => {
    currentStep++;

    let value = increment * currentStep;

    if (currentStep >= steps) {
      value = currentValue;
      clearInterval(interval);
    }

    progressElement.value = value;
    textElement.textContent = `${Math.floor(value)}/${maxValue}`;
  }, intervalTime);
}
// Makes the goal progress animation (number growing, caret moving, color changing, message typing)
async function SetProgress(progress, motivationalMessage) {
  const targetProgress = Math.round(progress);
  const motivationalMessageElement = document.querySelector(
    ".motivational-message",
  );
  const percentageElement = document.querySelector(".percentage");

  // Step 1: animate number
  await animatePercentage(0, targetProgress, percentageElement);
  colorPercentage(targetProgress);
  typeMessage(motivationalMessage, motivationalMessageElement, 50);
  animateCaret(targetProgress);
  // Step 2: after number finishes, run these three in parallel
}
// Increases percentage progressively

async function animatePercentage(current, target, element) {
  return new Promise((resolve) => {
    function step() {
      if (current >= target) {
        resolve();
        return;
      }
      current++;
      element.textContent = current;

      let delay = 20;
      if (current / target > 0.75) {
        delay = 20 + (target / (target - current + 1)) * 10;
      }

      setTimeout(step, delay);
    }

    step();
  });
}
// Moves the caret
function animateCaret(progress) {
  const caret = document.querySelector(".total-ui-caret");
  document.documentElement.style.setProperty("--goal", `${progress * 4.285}px`);
  caret?.classList.add("total-ui-caret-move");
}
// Colors the percentage span
function colorPercentage(progress) {
  const color = Goal.getProgressColor(progress);
  const percentageOuterSpan = document.querySelector(".total-ui-span");
  document.documentElement.style.setProperty("--color", color);
  percentageOuterSpan?.classList.add("total-ui-span-color");
}
// Types the motivational message
function typeMessage(message, container, speed = 50) {
  container.textContent = "";
  let i = 0;

  function typeChar() {
    if (i < message.length) {
      container.textContent += message[i];
      i++;
      setTimeout(typeChar, speed);
    }
  }

  // small delay before typing starts
  setTimeout(typeChar, 1000);
}
