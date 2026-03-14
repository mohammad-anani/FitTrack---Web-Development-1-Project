const sequencesKey = "tableSequences";

export function getCurrent(tableName) {
  const sequences = JSON.parse(localStorage.getItem(sequencesKey) || "{}");
  if (!(tableName in sequences)) {
    return 0;
  }
  return sequences[tableName];
}

export function increment(tableName) {
  const sequences = JSON.parse(localStorage.getItem(sequencesKey) || "{}");
  const current = sequences[tableName] ?? 0;
  const next = current + 1;
  sequences[tableName] = next;
  localStorage.setItem(sequencesKey, JSON.stringify(sequences));
  return next;
}
