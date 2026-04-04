import { Goal } from "../Data/Goal.js";
import { User } from "../Data/User.js";
import { Workout } from "../Data/Workout.js";
import { renderCurrentGoal } from "./goalProgress.js";

const user = User.getCurrentUser();

const workouts = await Workout.getWorkoutsByUser(user.id);

const totalWorkouts = workouts.length;

const totalCalories = workouts.reduce((acc, w, c, i) => acc + w.calories, 0);

const goals = Goal.getAllGoals([["userId", user.id]]);

const totalGoals = goals.length;

const workoutsStat = document.getElementById("workouts");
const caloriesStat = document.getElementById("calories");
const goalsStat = document.getElementById("goals");

workoutsStat.textContent = totalWorkouts;
caloriesStat.textContent = totalCalories;
goalsStat.textContent = totalGoals;

const currentGoal = Goal.getCurrentUserGoal(user.id);
const currentGoalDiv = document.querySelector(".currentGoal");

currentGoal
  ? await renderCurrentGoal(currentGoal, currentGoalDiv)
  : document.write("HI");
