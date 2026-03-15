import { User } from "../../Data/User.js";
import { Workout } from "../../Data/Workout.js";
import { WorkoutType } from "../../Data/WorkoutType.js";

const nameInput = document.getElementById("name");
const typeSelect = document.getElementById("type");
const dateInput = document.getElementById("date");
const durationInput = document.getElementById("duration");
const caloriesInput = document.getElementById("calories");

const nameValidation = document.getElementById("nameValidation");
const typeValidation = document.getElementById("typeValidation");
const dateValidation = document.getElementById("dateValidation");
const durationValidation = document.getElementById("durationValidation");
const caloriesValidation = document.getElementById("caloriesValidation");

const form = document.getElementById("workoutForm");

const user = User.createInstance(
  JSON.parse(sessionStorage.getItem("currentUser")),
);

const types = WorkoutType.getAllTypes();
types.forEach((type) => {
  const option = document.createElement("option");
  option.value = type;
  option.textContent = type;
  typeSelect.appendChild(option);
});

nameInput.addEventListener("input", () => {
  nameValidation.textContent =
    nameInput.value.trim().length < 3
      ? "Minimum name length is 3 characters"
      : "";
});

typeSelect.addEventListener("change", () => {
  typeValidation.textContent =
    typeSelect.value === "" ? "Please select a type" : "";
});

durationInput.addEventListener("input", () => {
  durationValidation.textContent =
    durationInput.value <= 0 ? "Duration must be greater than 0" : "";
});

caloriesInput.addEventListener("input", () => {
  caloriesValidation.textContent =
    caloriesInput.value <= 0 ? "Calories must be greater than 0" : "";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const isValid =
    nameValidation.textContent === "" &&
    typeValidation.textContent === "" &&
    durationValidation.textContent === "" &&
    caloriesValidation.textContent === "" &&
    dateInput.value !== "";

  if (!isValid) return;

  const workout = new Workout(
    -1,
    user.id,
    nameInput.value,
    typeSelect.value,
    dateInput.value,
    parseInt(durationInput.value),
    parseInt(caloriesInput.value),
  );

  const success = workout.addWorkout();

  if (success) {
    window.location.href = "/workouts"; // Or wherever you'd like to redirect
  }
});
