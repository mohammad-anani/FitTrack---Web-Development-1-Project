import { User } from "../../Data/User.js";
import { Workout } from "../../Data/Workout.js";
import { WorkoutType } from "../../Data/WorkoutType.js";
import { navigate } from "../../Global/navbar.js";

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

const user = User.getCurrentUser();

const types = await WorkoutType.getAllTypes();
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

// dateInput.addEventListener("input", () => {
//   const selectedDate = new Date(dateInput.value);
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   if (dateInput.value === "") {
//     dateValidation.textContent = "Please select a date";
//   } else if (selectedDate < today) {
//     dateValidation.textContent = "Date cannot be in the past";
//   } else {
//     dateValidation.textContent = "";
//   }
// });

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

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const isValid =
    nameValidation.textContent === "" &&
    typeValidation.textContent === "" &&
    durationValidation.textContent === "" &&
    caloriesValidation.textContent === "" &&
    dateValidation.textContent === "" &&
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

  const success = await workout.addWorkout();

  if (success) {
    {
      const workoutsNavLink = document.querySelector(".workouts.nav-link");
      navigate(workoutsNavLink);
    }
  }
});
