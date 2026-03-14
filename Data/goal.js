import {
  add,
  deleteByID,
  getAll,
  getByID,
  updateByID,
} from "./util/tablesManager";

import { Workout } from "./workout";

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

    const diffToMonday = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(new Date(d).setDate(diffToMonday));
    const sunday = new Date(new Date(monday).setDate(monday.getDate() + 6));

    return {
      monday: monday.toISOString().split("T")[0],
      sunday: sunday.toISOString().split("T")[0],
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
    const { monday, sunday } = this.getWeekRange(new Date());
    const data = getAll(tableName, [
      ["userId", userId],
      ["weekStartDate", monday],
    ]);
    return data.length > 0 ? Goal.createInstance(data[0]) : null;
  }

  addGoal() {
    const { monday, sunday } = this.getWeekRange(new Date());
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
    this.calorieTarget = 0;
    this.workoutTarget = 0;
    return this.updateGoal();
  }

  static deleteGoalByID(id) {
    return deleteByID(tableName, id, idKey);
  }

  static userHasCurrentGoal(userId) {
    return !!this.getCurrentUserGoal(userId);
  }

  static getGoalWorkouts(goalId) {
    const goal = this.getGoalById(goalId);
    const { monday, sunday } = Goal.getWeekRange(goal.weekStartDate);
    const userWorkouts = Workout.getWorkoutsByUser(goal.userId);
    return userWorkouts.filter((workout) => {
      return workout.date >= monday && workout.date <= sunday;
    });
  }

  static getUserGoals(userId) {
    return Goal.getAllGoals([["userId", userId]]);
  }

  static getGoalStats(goalId) {
    const goal = Goal.getGoalById(goalId);
    if (!goal) return null;

    const workoutsInGoalWeek = Goal.getGoalWorkouts(goalId);

    const weeklyCalories = workoutsInGoalWeek.reduce(
      (sum, w) => sum + (Number(w.calories) || 0),
      0,
    );
    const weeklyCount = workoutsInGoalWeek.length;

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

    return {
      weeklyCalories,
      weeklyCount,
      calorieGoal,
      workoutGoal,
      calorieProgress,
      workoutProgress,
      motivationalMessage: this.getMotivationalMessage(
        (calorieProgress + workoutProgress) / 2,
      ),
    };
  }

  static getMotivationalMessage(progress) {
    if (progress === 0) return "Let's get started on your goals this week!";
    if (progress < 25) return "Great start! Keep pushing!";
    if (progress < 50) return "You're doing well! Halfway there!";
    if (progress < 75) return "Almost there! Don't stop now!";
    if (progress < 100) return "So close to your weekly goal! You got this!";
    return "Amazing job! You've crushed your goal for the week!";
  }

  isCompleted() {
    const stats = this.getGoalStats(this.id);
    if (!stats) return false;

    return stats.calorieProgress >= 100 && stats.workoutProgress >= 100;
  }
}
