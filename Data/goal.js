import {
  add,
  deleteByID,
  getAll,
  getByID,
  updateByID,
} from "./util/localStorageManager.js";

import { Workout } from "./Workout.js";

const tableName = "goals";
const idKey = "id";

export class Goal {
  constructor(
    id = -1,
    userId = -1,
    weekStartDate = "",
    calorieTarget = 0,
    workoutTarget = 0,
  ) {
    this.id = id;
    this.userId = userId;
    this.weekStartDate = weekStartDate || Goal.getWeekRange(new Date()).monday;
    this.calorieTarget = calorieTarget;
    this.workoutTarget = workoutTarget;
  }

  static getWeekRange(date) {
    const d = new Date(date);
    const day = d.getDay();

    // Calculate Monday of the week
    const diffToMonday = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d);
    monday.setDate(diffToMonday);

    // Sunday = Monday + 6
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    // Format YYYY-MM-DD
    const formatDate = (dt) => {
      const y = dt.getFullYear();
      const m = String(dt.getMonth() + 1).padStart(2, "0");
      const day = String(dt.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    return {
      monday: formatDate(monday),
      sunday: formatDate(sunday),
    };
  }

  static createInstance(data) {
    if (!data) return null;
    return new Goal(
      data.id,
      data.userId,
      data.weekStartDate,
      data.calorieTarget,
      data.workoutTarget,
    );
  }

  static getAllGoals(filter = null) {
    const data = getAll(tableName, filter);
    return data.map((obj) => Goal.createInstance(obj));
  }

  static getGoalById(id) {
    return getByID(tableName, id, idKey);
  }

  static getCurrentUserGoal(userId) {
    const { monday, sunday } = Goal.getWeekRange(new Date());
    console.log(monday);
    const data = Goal.getAllGoals([
      ["userId", userId],
      ["weekStartDate", monday],
    ]);
    return data.length > 0 ? Goal.createInstance(data[0]) : null;
  }

  addGoal() {
    const { monday, sunday } = Goal.getWeekRange(new Date());

    const dataToSave = {
      id: this.id,
      userId: this.userId,
      weekStartDate: monday,
      calorieTarget: this.calorieTarget,
      workoutTarget: this.workoutTarget,
    };
    return add(tableName, dataToSave, idKey);
  }

  updateGoal() {
    return updateByID(tableName, { ...this }, idKey);
  }

  resetGoal() {
    return Goal.deleteGoalByID(this.id);
  }

  static deleteGoalByID(id) {
    return deleteByID(tableName, id, idKey);
  }

  static userHasCurrentGoal(userId) {
    return !!Goal.getCurrentUserGoal(userId);
  }

  static async getGoalWorkouts(goalId) {
    const goal = Goal.getGoalById(goalId);
    const { monday, sunday } = Goal.getWeekRange(goal.weekStartDate);
    const userWorkouts = await Workout.getWorkoutsByUser(goal.userId);
    return userWorkouts.filter((workout) => {
      return workout.date >= monday && workout.date <= sunday;
    });
  }

  static getUserGoals(userId) {
    return Goal.getAllGoals([["userId", userId]]);
  }

  static async getGoalStats(goalId) {
    const goal = Goal.getGoalById(goalId);
    if (!goal) return null;

    const workoutsInGoalWeek = await Goal.getGoalWorkouts(goalId);

    const weeklyCalories =
      workoutsInGoalWeek?.reduce(
        (sum, w) => sum + (Number(w.calories) || 0),
        0,
      ) || 0;
    const weeklyCount = workoutsInGoalWeek?.length || 0;

    const calorieGoal = Number(goal.calorieTarget) || 0;
    const workoutGoal = Number(goal.workoutTarget) || 0;

    let calorieProgress = 0;
    let workoutProgress = 0;

    if (calorieGoal > 0) {
      calorieProgress = Math.min(
        100,
        Math.round((weeklyCalories / calorieGoal) * 100),
      );
    }

    if (workoutGoal > 0) {
      workoutProgress = Math.min(
        100,
        Math.round((weeklyCount / workoutGoal) * 100),
      );
    }
    const totalProgress = (calorieProgress + workoutProgress) / 2;
    return {
      weeklyCalories,
      weeklyCount,
      calorieGoal,
      workoutGoal,
      calorieProgress,
      workoutProgress,
      totalProgress,
      motivationalMessage: Goal.getMotivationalMessage(totalProgress),
    };
  }

  static getMotivationalMessage(progress) {
    if (progress === 0) return "Let's get started on your goals this week!";
    if (progress < 25) return "Great start! Keep pushing!";
    if (progress < 50)
      return "You're doing well! Heading toward the halfway mark!";

    if (progress < 62.5)
      return "Over the hump! You're officially in the Orange zone!";
    if (progress < 75)
      return "Solid consistency! The Yellow zone looks good on you!";
    if (progress < 87.5)
      return "Incredible momentum! You're deep in the Green now!";
    if (progress < 100)
      return "Final stretch! Only a few more steps to the finish line!";

    return "Amazing job! You've crushed your goal for the week!";
  }

  isCompleted() {
    const stats = Goal.getGoalStats(this.id);
    if (!stats) return false;

    return stats.calorieProgress >= 100 && stats.workoutProgress >= 100;
  }
}
