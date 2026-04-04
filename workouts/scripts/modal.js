const filterButton = document.getElementById("filter");
const xButton = document.getElementById("x-button");
const modalSection = document.querySelector(".modal");
const blur = document.querySelector(".blur");

addModalListeners();
blurClickListener();

export function openModal() {
  blur.style.display = "block";
  modalSection.style.display = "flex";
}

export function closeModal() {
  modalSection.style.display = "none";
  blur.style.display = "none";
}

function addModalListeners() {
  xButton.addEventListener("click", (e) => {
    closeModal();
  });

  filterButton.addEventListener("click", (e) => {
    openModal();
  });
}

function blurClickListener() {
  blur.addEventListener("click", () => {
    closeModal();
  });
}
