import { User } from "../Data/User.js";
import { Workout } from "../Data/Workout.js";
import { WorkoutType } from "../Data/WorkoutType.js";
let listDiv = document.getElementById("list");

const sortSelect = document.getElementById("sort");
const orderRadios = document.querySelectorAll("input[name='order']");
const typeSelect = document.getElementById("type");
const fromInput = document.getElementById("from");
const toInput = document.getElementById("to");
const nameInput = document.getElementById("name");

const types = WorkoutType.getAllTypes();
types.forEach((type) => {
  const option = document.createElement("option");
  option.value = type;
  option.textContent = type;
  typeSelect.appendChild(option);
});

const user = User.createInstance(
  JSON.parse(sessionStorage.getItem("currentUser")),
);

function displayWorkout(workout) {
  return `<div>
        <b>${workout.name}</b>
        <span>${workout.type}</span>
        <span>${workout.duration}</span>
        <span>${workout.calories}</span>
        <span>${workout.date}</span>
        <button data-id=${workout.id} class="delete-workout">Delete</button>
      </div>`;
}

function render(workouts) {
  listDiv.innerHTML =
    workouts.length > 0
      ? workouts.map((w) => displayWorkout(w)).join("")
      : "NO WORKOUTS";

  document.querySelectorAll(".delete-workout").forEach((element) => {
    element.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      Workout.deleteWorkoutByID(Number(id));
      window.location.reload();
    });
  });
}

function applyFilters() {
  const filters = [];

  if (typeSelect.value) filters.push(["type", typeSelect.value]);
  if (nameInput.value) filters.push(["name", nameInput.value]);

  const sortKey = sortSelect.value;
  const isAsc =
    document.querySelector("input[name='order']:checked")?.value === "asc";

  let workouts = Workout.getWorkoutsByUser(user.id, filters, sortKey, isAsc);

  if (fromInput.value)
    workouts = workouts.filter(
      (w) => new Date(w.date) >= new Date(fromInput.value),
    );

  if (toInput.value)
    workouts = workouts.filter(
      (w) => new Date(w.date) <= new Date(toInput.value),
    );

  render(workouts);
}

[sortSelect, typeSelect, fromInput, toInput, nameInput].forEach((el) =>
  el.addEventListener("change", applyFilters),
);

orderRadios.forEach((r) => r.addEventListener("change", applyFilters));

applyFilters();
