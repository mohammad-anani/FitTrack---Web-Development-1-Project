import { getAll } from "./util/tablesManager.js";

const tableName = "types";

export class WorkoutType {
  static getAllTypes() {
    return getAll(tableName);
  }

  static updateTypes(types) {
    localStorage.setItem(tableName, JSON.stringify(types));
  }

  static seedDefaultData() {
    const types = WorkoutType.getAllTypes();
    if (!types || types.length === 0) {
      const defaultTypes = ["Strength", "Yoga", "Cardio"];
      localStorage.setItem(tableName, JSON.stringify(defaultTypes));
    }
  }
}

WorkoutType.seedDefaultData();
