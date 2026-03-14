import { increment } from "./tableSequence";

function filterRowCallback(kvp_filter) {
  return (row) => {
    for (const [key, value] of kvp_filter) {
      if (typeof value === "string" && row[key]?.includes(value)) {
        continue;
      }
      if (row[key] !== value) {
        return false;
      }
    }
    return true;
  };
}

function sortRowsCallback(key, asc = true) {
  return (a, b) => {
    const valA = a[key];
    const valB = b[key];
    if (valA === valB) return 0;
    if (valA == null) return 1;
    if (valB == null) return -1;
    if (valA < valB) return asc ? -1 : 1;
    if (valA > valB) return asc ? 1 : -1;
    return 0;
  };
}

function getAll(tableName, kvp_filter = null, sortingKey = null, isAsc = true) {
  if (!tableName || typeof tableName !== "string") return null;

  let tableData = JSON.parse(localStorage.getItem(tableName) || "[]");

  if (!Array.isArray(tableData)) return null;
  if (Array.isArray(kvp_filter) && kvp_filter.length > 0) {
    tableData = tableData.filter(filterRowCallback(kvp_filter));
  }

  if (sortingKey) {
    tableData.sort(sortRowsCallback(sortingKey, isAsc));
  }

  return tableData;
}

function getByID(tableName, id, idKey = "id") {
  const items = getAll(tableName, [[idKey, id]]);
  if (!items || items.length !== 1) return null;
  return items[0];
}

function add(tableName, newItem, idKey = "id") {
  const items = getAll(tableName) || [];

  const nextID = increment(tableName);
  if (typeof newItem === "object") {
    newItem[idKey] = nextID;
  }
  const newItems = [...items, newItem];
  localStorage.setItem(tableName, JSON.stringify(newItems));
  return nextID;
}

function updateByID(tableName, newItem, idKey = "id") {
  const items = getAll(tableName);
  if (!items) return false;
  if (!idExists(tableName, newItem[idKey], idKey)) return false;
  const newItems = items.map((row) =>
    row[idKey] === newItem[idKey] ? { ...row, ...newItem } : row,
  );
  localStorage.setItem(tableName, JSON.stringify(newItems));
  return true;
}

function deleteByID(tableName, id, idKey = "id") {
  const items = getAll(tableName);
  if (!items) return false;
  const newItems = items.filter((row) => row[idKey] !== id);
  localStorage.setItem(tableName, JSON.stringify(newItems));
  return true;
}

function idExists(tableName, id, idKey = "id") {
  return !!getByID(tableName, id, idKey);
}

export { add, deleteByID, getAll, getByID, idExists, updateByID };
