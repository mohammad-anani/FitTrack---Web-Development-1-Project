import { add, deleteByID, getAll, getByID, updateByID } from "./tablesManager";

const tableName = "workouts";
const idKey = "id";

export class Workout {
  constructor(
    id = -1,
    userId = -1,
    name = "",
    type = "",
    date = "",
    duration = 0,
    calories = 0,
  ) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.type = type;
    this.date = date;
    this.duration = duration;
    this.calories = calories;
  }

  static createInstance(data) {
    if (!data) return null;
    return new Workout(
      data.id,
      data.userId,
      data.name,
      data.type,
      data.date,
      data.duration,
      data.calories,
    );
  }

  static getAllWorkouts(filter = null, sortKey = [], isAsc = true) {
    const data = getAll(tableName, filter, sortKey, isAsc);
    return data.map((obj) => Workout.createInstance(obj));
  }

  static getWorkoutsByUser(userId) {
    const data = getAll(tableName, [["userId", userId]]);
    return data.map((obj) => Workout.createInstance(obj));
  }

  static getWorkoutByID(id) {
    const data = getByID(tableName, id, idKey);
    return Workout.createInstance(data);
  }

  addWorkout() {
    return add(tableName, { ...this }, idKey);
  }

  updateWorkout() {
    return updateByID(tableName, { ...this }, idKey);
  }

  static deleteWorkoutByID(id) {
    return deleteByID(tableName, id, idKey);
  }
}
