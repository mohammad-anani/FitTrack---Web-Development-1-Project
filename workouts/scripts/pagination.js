const backPageButton = document.querySelector(".page-link.back");
const nextPageButton = document.querySelector(".page-link.next");
const paginationContainer = document.querySelector(".pagination");

//current and total pages are functions because we need to ensure function enclosure(variable in function scope gets saved and accessed here)
export function displayPaginationLinks(currentPage, totalPages, onPageChange) {
  const numberButtons =
    paginationContainer.querySelectorAll(".page-link.number");

  numberButtons.forEach((btn) => btn.remove());

  if (totalPages() === 0) return;

  for (let i = 1; i <= totalPages(); i++) {
    const btn = document.createElement("button");
    btn.textContent = i;

    btn.className = `page-link number ${i === currentPage() ? "active" : ""}`;

    btn.addEventListener("click", () => {
      onPageChange(i);
    });

    nextPageButton.before(btn);
  }

  refreshPageLinks(currentPage(), totalPages());
}

export function attachPaginationListeners(
  currentPage,
  totalPages,
  onPageChange,
) {
  backPageButton.addEventListener("click", () => {
    if (currentPage() > 1) {
      onPageChange(currentPage() - 1);
    }
  });

  nextPageButton.addEventListener("click", () => {
    if (currentPage() < totalPages()) {
      onPageChange(currentPage() + 1);
    }
  });
}

function refreshPageLinks(currentPage, totalPages) {
  const pageLinks = paginationContainer.querySelectorAll(".page-link.number");

  for (let i = 0; i < pageLinks.length; i++) {
    const pageLink = pageLinks[i];

    pageLink.className = `page-link number ${
      i + 1 === currentPage ? "active" : ""
    }`;
  }

  backPageButton.classList.toggle("disabled", currentPage === 1);
  nextPageButton.classList.toggle("disabled", currentPage === totalPages);
}
