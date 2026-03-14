const tables = ["users", "goals", "workouts", "types"];

export function initTablesInLocalStorage() {
  tables.forEach((tableName) => {
    if (!localStorage.getItem(tableName)) {
      localStorage.setItem(tableName, JSON.stringify([]));
    }
  });

  if (!localStorage.getItem("tableSequences")) {
    const sequences = {};
    tables.forEach((tableName) => {
      sequences[tableName] = 0;
    });
    localStorage.setItem("tableSequences", JSON.stringify(sequences));
  }
}
