import { Goal } from "../../Data/Goal.js";
import {
  attachPaginationListeners,
  displayPaginationLinks,
} from "./pagination.js";
import { handleResponsiveTable } from "./responsiveTable.js";

let tableBody = document.getElementById("goals-tbody");
const rowCountSpan = document.getElementById("record-count");
const rowsPerPage = 2;

let currentPage = 1;
let totalPages = 0;
let goals = [];

export async function getPreviousGoals(currentGoal, user) {
  const allGoals = Goal.getUserGoals(user.id);

  goals = currentGoal
    ? allGoals?.filter((a) => a.id !== currentGoal.id)
    : allGoals;
  await renderGoals();
}

attachPaginationListeners(
  () => currentPage,
  () => totalPages,
  (page) => {
    currentPage = page;
    renderGoals();
  },
);

async function renderGoals() {
  totalPages = Math.ceil(goals.length / rowsPerPage);

  rowCountSpan.textContent = String(goals.length ?? 0);

  const paged = paginateGoals(goals);

  await fillUserGoals(paged);

  displayPaginationLinks(
    () => currentPage,
    () => totalPages,
    async (page) => {
      currentPage = page;
      await renderGoals();
    },
  );
}

function paginateGoals(data) {
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  return data.slice(startIndex, endIndex);
}

async function displayGoal(goal) {
  const stats = await Goal.getGoalStats(goal.id);
  return `<tr>
    <td>${goal.weekStartDate}</td>
    <td>${stats.weeklyCalories}/${goal.calorieTarget}</td>
    <td>${stats.weeklyCount}/${goal.workoutTarget}</td>
   <td style="color:${getProgressColor(stats.totalProgress)}">${stats.totalProgress}</td>
    <td>
${stats.totalProgress >= 100 ? "Yes" : "No"}
    </td>
  </tr>`;
}

function getProgressColor(progress) {
  if (progress < 40) return "red";
  if (progress < 60) return "orange";
  if (progress < 80) return "yellow";
  if (progress < 90) return "green";
  return "blue";
}

async function fillUserGoals(goals) {
  tableBody.innerHTML =
    goals.length > 0
      ? (await Promise.all(goals.map((g) => displayGoal(g)))).join("")
      : "<span class='empty'>No Previous +Goals</span>";

  handleResponsiveTable();
}
