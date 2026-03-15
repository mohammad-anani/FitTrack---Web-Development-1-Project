import { Goal } from "../Data/Goal.js";
import { User } from "../Data/User.js";

const currentGoalDiv = document.getElementById("currentGoal");
const user = User.createInstance(
  JSON.parse(sessionStorage.getItem("currentUser")),
);

const currentGoal = Goal.getCurrentUserGoal(user.id);

if (currentGoal) {
  const stats = Goal.getGoalStats(currentGoal.id);
  currentGoalDiv.innerHTML = `<h2>Current Goal (${currentGoal.weekStartDate})</h2>
<span>Calories:</span>
<progress id="caloriesProgress"
          value="${stats.weeklyCalories}"
          max="${stats.calorieGoal}">
</progress>
<span>${stats.weeklyCalories}/${stats.calorieGoal}</span>
<br><br>
<span>Workouts:</span>
<progress id="workoutsProgress"
          value="${stats.weeklyCount}"
          max="${stats.workoutGoal}">
</progress>
<span>${stats.weeklyCount}/${stats.workoutGoal}</span>
<br><br>
<h2>Total Progress: <b>${stats.totalProgress}%</b></h2>
<progress id="totalProgress"
          value="${stats.totalProgress}"
          max="100">
</progress>
<h3>${stats.motivationalMessage}</h3>
`;
} else {
  currentGoalDiv.innerHTML = ` <span> No goal set for this week </span>
<form id="form">
        <label for="caloriesInput">Calories</label>
        <input type="number" name="calories" id="caloriesInput" />
        <label for="workoutsInput">Workouts</label>
        <input type="number" name="workouts" id="workoutsInput" />
        <button type="submit">Set</button></form> `;
}

const form = document.getElementById("form");
const caloriesInput = document.getElementById("caloriesInput");
const workoutsInput = document.getElementById("workoutsInput");
form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const goal = new Goal(
    -1,
    user.id,
    Goal.getWeekRange(new Date())[0],
    Number(caloriesInput.value),
    Number(workoutsInput.value),
  );
  goal.addGoal();
  window.location.reload();
});

const goalsDiv = document.getElementById("goals-list");

const allGoals = Goal.getUserGoals(user.id);
const prevGoals = allGoals?.filter((a) => a.id !== currentGoal.id);

if (prevGoals?.length > 0) {
  goalsDiv.innerHTML = prevGoals.map(
    (goal) =>
      `<span>${goal.weekStartDate} ${goal.isCompleted() ? "Completed" : "Not Completed"}</span><br/>`,
  );
} else {
  goalsDiv.innerHTML = "NO PREV";
}
