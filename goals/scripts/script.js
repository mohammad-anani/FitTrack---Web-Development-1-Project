import { Goal } from "../../Data/Goal.js";
import { User } from "../../Data/User.js";
import { renderCurrentGoal } from "./currentGoal.js";
import { getPreviousGoals } from "./previousGoals.js";
import { renderSetGoal } from "./setGoal.js";

export const currentGoalDiv = document.getElementById("currentGoal");
export const user = User.getCurrentUser();
export const currentGoal = Goal.getCurrentUserGoal(user.id);
export const goalsDiv = document.getElementById("goals");

getPreviousGoals(currentGoal, user);
currentGoal
  ? await renderCurrentGoal(currentGoal, currentGoalDiv)
  : renderSetGoal(currentGoalDiv, user);
