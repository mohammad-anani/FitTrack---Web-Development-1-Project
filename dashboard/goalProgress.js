import { Goal } from "../../Data/Goal.js";

export async function renderCurrentGoal(currentGoal, currentGoalDiv) {
  const stats = await Goal.getGoalStats(currentGoal.id);

  currentGoalDiv.innerHTML = `
    <div class='total-div'>
      <h3><u>Current Goal Total Progress</u></h3>
      <div class="total-ui-div">
        <span class="total-ui-span">
          <span class="percentage">0</span>%
        </span>
        <div class="total-ui-progress">
          <div class="total-ui-caret">
            <i class="fa-solid fa-caret-down"></i>
            <span class='caret'>|</span>
          </div>
        </div>
        <h3 class='motivational-message'></h3>
      </div>
    </div>
  `;

  await SetProgress(stats.totalProgress, stats.motivationalMessage);
}

async function SetProgress(progress, motivationalMessage) {
  const targetProgress = Math.round(progress);
  const motivationalMessageElement = document.querySelector(
    ".motivational-message",
  );
  const percentageElement = document.querySelector(".percentage");

  await animatePercentage(0, targetProgress, percentageElement);
  colorPercentage(targetProgress);
  typeMessage(motivationalMessage, motivationalMessageElement, 50);
  animateCaret(targetProgress);
}

async function animatePercentage(current, target, element) {
  return new Promise((resolve) => {
    function step() {
      if (current >= target) {
        element.textContent = target;
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

function animateCaret(progress) {
  const caret = document.querySelector(".total-ui-caret");
  // 430px (width) / 100 = 4.3px per 1%
  document.documentElement.style.setProperty("--goal", `${progress * 4.3}px`);
  caret?.classList.add("total-ui-caret-move");
}

function colorPercentage(progress) {
  const color = getProgressColor(progress);
  const percentageOuterSpan = document.querySelector(".total-ui-span");
  document.documentElement.style.setProperty("--color", color);
  percentageOuterSpan?.classList.add("total-ui-span-color");
}

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
  setTimeout(typeChar, 1000);
}

function getProgressColor(progress) {
  if (progress < 50) return "red";
  if (progress < 62.5) return "orange";
  if (progress < 75) return "yellow";
  if (progress < 87.5) return "green";
  return "blue";
}
