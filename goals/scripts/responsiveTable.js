const main = document.querySelector("main");
const table = document.querySelector("table");
const initialColumns = 5;
let columnsToShow = initialColumns;

//This function handles removing columns progressively from the table for responsivity
export function handleResponsiveTable() {
  //responsive to main object not the whole window
  const width = main.offsetWidth;

  //specify number of columns for each range of px
  if (width < 600) columnsToShow = 2;
  else if (width < 800) columnsToShow = 3;
  else if (width < 1000) columnsToShow = 4;
  else columnsToShow = 5;

  const rows = table.querySelectorAll("tr");

  //for each row, we skip first and last column, and start eliminating from end
  //we also skip last row(it is the footer)
  rows.forEach((row, index) => {
    if (index === rows.length - 1) return;

    //row has children cells(td or th)
    const cells = row.children;

    for (let i = 0; i < initialColumns; i++) {
      if (!cells[i]) continue;

      const isFirst = i === 0;
      const isLast = i === initialColumns - 1;

      if (isFirst || isLast) {
        cells[i].style.display = "";
        continue;
      }

      if (i < columnsToShow - 1) {
        cells[i].style.display = "";
      } else {
        cells[i].style.display = "none";
      }
    }

    //set style for grid after changing in UI
    row.style.gridTemplateColumns = `repeat(${columnsToShow},1fr)`;
  });
}

//Runs when window is resized
window.addEventListener("resize", handleResponsiveTable);

//Runs on start
document.addEventListener("DOMContentLoaded", handleResponsiveTable);
