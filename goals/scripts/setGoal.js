import { Goal } from "../../Data/Goal.js";

export async function renderSetGoal(currentGoalDiv, user) {
  currentGoalDiv.innerHTML = `
    <h2>Goals</h2>
    <u class="no-goal">No goal set for this week. Set New Goal:</u>

    <form id="form">
      <section class="inputs-div">
        <!-- Calories Input Field -->
        <label for="caloriesInput">Calories</label>
        <div class='input-div'>
          <input 
            type="number" 
            name="calories" 
            id="caloriesInput" 
            min="1" 
            required 
          />
          <span class='validation'  id="caloriesValidation"></span>
        </div>

        <!-- Workouts Input Field -->
        <label for="workoutsInput">Workouts</label>
        <div class='input-div'>
          <input 
            type="number" 
            name="workouts" 
            id="workoutsInput" 
            min="1" 
            required 
          />
          <span class='validation' id="workoutsValidation"></span>
        </div>
      </section>

      <button type="submit">Set</button>
    </form>
  `;

  initiateForm(user);
}
function initiateForm(user) {
  const form = document.getElementById("form");
  const caloriesInput = document.getElementById("caloriesInput");
  const workoutsInput = document.getElementById("workoutsInput");
  const caloriesValidation = document.getElementById("caloriesValidation");
  const workoutsValidation = document.getElementById("workoutsValidation");

  // Form input validation
  caloriesInput?.addEventListener("input", () => {
    caloriesValidation.textContent =
      caloriesInput.value <= 0 ? "Calories must be greater than 0" : "";
  });

  workoutsInput?.addEventListener("input", () => {
    workoutsValidation.textContent =
      workoutsInput.value <= 0 ? "Workouts must be greater than 0" : "";
  });

  // Form submit
  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    const isValid =
      caloriesValidation.textContent === "" &&
      workoutsValidation.textContent === "" &&
      caloriesInput.value !== "" &&
      workoutsInput.value !== "";

    if (!isValid) return;

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
}
