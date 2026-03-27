export function filterRowCallback(kvp_filter) {
  return (row) => {
    for (const [key, value] of kvp_filter) {
      if (typeof value === "string" && row[key]?.includes(value)) {
        return true;
      }
      if (row[key] !== value) {
        return false;
      }
    }
    return true;
  };
}

export function sortRowsCallback(key, asc = true) {
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
