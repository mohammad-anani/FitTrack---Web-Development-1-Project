import { Workout } from "../../Data/Workout.js";
import { navigate } from "../../Global/navbar.js";
import { filterInputsChangeListeners, getFilteredWorkouts } from "./filter.js";
import {
  attachPaginationListeners,
  displayPaginationLinks,
} from "./pagination.js";
import { handleResponsiveTable } from "./responsiveTable.js";

addAddListener();

const tableBody = document.getElementById("workouts-tbody");
const rowCountSpan = document.getElementById("record-count");
const rowsPerPage = 2;
let currentPage = 1;
let totalPages = 0;
let filteredWorkouts = [];

await refreshFilteredWorkouts();
filterInputsChangeListeners(refreshFilteredWorkouts);

attachPaginationListeners(
  () => currentPage,
  () => totalPages,
  (page) => {
    currentPage = page;
    renderWorkouts();
  },
);

async function refreshFilteredWorkouts() {
  currentPage = 1;
  filteredWorkouts = await getFilteredWorkouts();
  totalPages = Math.ceil(filteredWorkouts.length / rowsPerPage);
  if (totalPages === 0) currentPage = 0;
  renderWorkouts();
}

function renderWorkouts() {
  const paged = paginateWorkouts(filteredWorkouts);
  fillUserWorkouts(paged);
  displayPaginationLinks(
    () => currentPage,
    () => totalPages,
    (page) => {
      currentPage = page;
      renderWorkouts();
    },
  );
}

function paginateWorkouts(data) {
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  return data.slice(startIndex, endIndex);
}

function displayWorkout(workout) {
  console.log(workout);
  return `<tr>
    <td>${workout.name}</td>
    <td>${workout.type}</td>
    <td>${workout.calories}</td>
    <td>${workout.duration}</td>
    <td>${workout.date}</td>
    <td class='delete-td'>
      <button class="delete-workout" data-id=${workout.id}>
        <i class="fa-solid fa-trash"></i> Delete
      </button>
    </td>
  </tr>`;
}

function fillUserWorkouts(workouts) {
  tableBody.innerHTML =
    workouts.length > 0
      ? workouts.map(displayWorkout).join("")
      : "<span class='empty'>No Workouts</span>";

  handleResponsiveTable();

  rowCountSpan.textContent = String(filteredWorkouts.length ?? 0);

  addDeleteListeners();
}

function addDeleteListeners() {
  document.querySelectorAll(".delete-workout").forEach((element) => {
    element.addEventListener("click", async (e) => {
      const id = e.target.closest("button").dataset.id;

      if (confirm("Are you sure?")) {
        Workout.deleteWorkoutByID(Number(id));
        await refreshFilteredWorkouts();
      }
    });
  });
}

function addAddListener() {
  const addButton = document.getElementById("add");

  const logNavLink = document.querySelector(".log-workout.nav-link");

  addButton.addEventListener("click", () => {
    navigate(logNavLink);
  });
}
