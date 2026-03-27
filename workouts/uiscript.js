/**
 * Handles table responsiveness by hiding columns
 * based on the window width.
 */
function handleResponsiveTable() {
  const width = window.innerWidth;
  const table = document.querySelector(".workout-table");
  if (!table) return;

  // Define column limits (similar to your sliceEnd logic)
  // 1: Name, 2: Type, 3: Calories, 4: Duration, 5: Actions
  let columnsToShow = 5;

  if (width < 600)
    columnsToShow = 2; // Show Name + Actions
  else if (width < 800)
    columnsToShow = 3; // Show Name + Type + Actions
  else if (width < 1000) columnsToShow = 4; // Show Name + Type + Calories + Actions

  // Get all header cells and body rows
  const headers = table.querySelectorAll("thead th");
  const rows = table.querySelectorAll("tbody tr");

  headers.forEach((th, index) => {
    // We always want to show the LAST column (Actions/Delete)
    // and only show middle columns if within columnsToShow limit
    const isActionColumn = index === headers.length - 1;
    const shouldShow = index < columnsToShow - 1 || isActionColumn;

    const displayStyle = shouldShow ? "" : "none";

    // Hide the Header cell
    th.style.display = displayStyle;

    // Hide the corresponding cell in every row
    rows.forEach((row) => {
      const cell = row.children[index];
      if (cell) cell.style.display = displayStyle;
    });

    // Hide the footer cell (adjust colspan)
    const footerCell = table.querySelector("tfoot td");
    if (footerCell) {
      footerCell.colSpan = columnsToShow;
    }
  });
}

// Listen for window resizing
window.addEventListener("resize", handleResponsiveTable);

// Run once on page load
document.addEventListener("DOMContentLoaded", handleResponsiveTable);
