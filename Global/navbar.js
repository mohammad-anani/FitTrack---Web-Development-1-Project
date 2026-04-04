import { User } from "../Data/User.js";

let lastSelectedButton;
const selectionDiv = document.querySelector(".selection-div");
let nameSpan = document.querySelector(".user-name-span");
const navLinks = document.querySelectorAll(".nav-link");
const logoutButton = document.querySelector(".logout");
const loadingDiv = document.querySelector(".loading-div");

setSelectedNavlink();
fillInfo();
addNavButtonsEventListener();
addLogoutEventListener();

function setSelectedNavlink() {
  let savedIndex = sessionStorage.getItem("selectedNavIndex");
  if (savedIndex === null) {
    sessionStorage.setItem("selectedNavIndex", 1);
    savedIndex = 1;
  }
  selectionDiv.style.transition = "none";
  selectionDiv.style.top = 20 + 70 * Number(savedIndex) + "px";
  selectionDiv.offsetHeight;
  selectionDiv.style.transition = "top 0.15s";
}

function fillInfo() {
  const user = User.getCurrentUser();
  nameSpan.textContent = user.name;
}

function addNavButtonsEventListener() {
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navigate(link);
    });
  });
}

export function navigate(button) {
  if (button.dataset.index)
    sessionStorage.setItem("selectedNavIndex", button.dataset.index);

  selectButton(button);

  const destination = button.getAttribute("href");

  if (destination) {
    setTimeout(() => {
      window.location.href = destination;
    }, 125);
  }
}

function selectButton(button) {
  lastSelectedButton?.classList.remove("hover-disabled");
  lastSelectedButton = button;

  if (button.dataset.index && selectionDiv)
    selectionDiv.style.top = 20 + 70 * Number(button.dataset.index) + "px";
}

function addLogoutEventListener() {
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("savedUserID");
    sessionStorage.clear();
    loadingDiv.classList.add("loading-div-running");
    setTimeout(() => {
      window.location.replace("/login");
    }, 1000);
  });
}
