import { User } from "../../Data/User.js";
import { Workout } from "../../Data/Workout.js";

import { WorkoutType } from "../../Data/WorkoutType.js";
import { closeModal } from "./modal.js";

const sortSelect = document.getElementById("sort");
const ascRadio = document.getElementById("asc");
const descRadio = document.getElementById("desc");
const typeSelect = document.getElementById("type");
const fromInput = document.getElementById("from");
const toInput = document.getElementById("to");
const nameInput = document.getElementById("name");

const applyButton = document.getElementById("apply");
const resetButton = document.getElementById("reset");

const user = User.getCurrentUser();

await fillTypesInSelectFilter();

export async function getFilteredWorkouts() {
  const filters = [];

  if (typeSelect.value) filters.push(["type", typeSelect.value]);

  if (nameInput.value) filters.push(["name", nameInput.value]);

  const sortKey = sortSelect.value;
  const isAsc = !!ascRadio.checked;
  let workouts = await Workout.getWorkoutsByUser(
    user.id,
    filters,
    sortKey,
    isAsc,
  );

  if (fromInput.value)
    workouts = workouts.filter(
      (w) => new Date(w.date) >= new Date(fromInput.value),
    );

  if (toInput.value)
    workouts = workouts.filter(
      (w) => new Date(w.date) <= new Date(toInput.value),
    );
  return workouts;
}

async function fillTypesInSelectFilter() {
  const types = await WorkoutType.getAllTypes();

  types.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    typeSelect.appendChild(option);
  });
}

export function filterInputsChangeListeners(refreshWorkouts) {
  applyButton.addEventListener("click", async () => {
    await refreshWorkouts();
    closeModal();
  });

  resetButton.addEventListener("click", async () => {
    fromInput.value = null;
    toInput.value = null;
    ascRadio.checked = true;
    descRadio.checked = false;
    sortSelect.selectedIndex = 0;
    typeSelect.selectedIndex = 0;
  });

  nameInput.addEventListener("input", async () => {
    await refreshWorkouts();
  });
}
