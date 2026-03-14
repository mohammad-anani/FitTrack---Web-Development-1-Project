import { Goal } from "./goal";
import { encryptPassword } from "./passwordManager";
import {
  add,
  deleteByID,
  getAll,
  getByID,
  idExists,
  updateByID,
} from "./tablesManager";

const tableName = "users";
const idKey = "id";

export class User {
  constructor(id = -1, email = "", password = "", name = "") {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
  }

  static createInstance(data) {
    if (!data) return null;
    return new User(data.id, data.email, "", data.name);
  }

  static getAllUsers(filter = null) {
    const data = getAll(tableName, filter);
    return data.map((obj) => User.createInstance(obj));
  }

  static getUserByID(id) {
    const data = getByID(tableName, id, idKey);
    return User.createInstance(data);
  }

  addUser() {
    const userToSave = { ...this, password: encryptPassword(this.password) };
    return add(tableName, userToSave, idKey);
  }

  updateUser() {
    const userToSave = { ...this };

    if ("password" in userToSave) {
      delete userToSave.password;
    }

    return updateByID(tableName, userToSave, idKey);
  }

  static deleteUserByID(id) {
    return deleteByID(tableName, id, idKey);
  }

  static userExistsByEmail(email) {
    return idExists(tableName, email, "email");
  }

  static findUserByEmailAndPassword(email, password) {
    const filtered = getAll(tableName, [
      ["email", email],
      ["password", encryptPassword(password)],
    ]);

    if (!filtered || filtered.length === 0) return null;

    return User.createInstance(filtered[0]);
  }

  static userExistsByEmailAndPassword(email, password) {
    return !!this.findUserByEmailAndPassword(email, password);
  }

  static getGlobalStats(userId) {
    const workouts = Workout.getWorkoutsByUser(userId);
    const totalWorkouts = workouts.length;
    const totalCalories = workouts.reduce(
      (sum, workout) => sum + (Number(workout.calories) || 0),
      0,
    );
    const totalDuration = workouts.reduce(
      (sum, workout) => sum + (Number(workout.duration) || 0),
      0,
    );

    const goals = Goal.getUserGoals(userId);
    const totalGoals = goals.length;
    const completedGoals = goals.reduce(
      (total, goal) => total + Number(goal.isCompleted()),
      0,
    );

    return {
      totalWorkouts,
      totalCalories,
      totalDuration,
      totalGoals,
      completedGoals,
    };
  }
}
