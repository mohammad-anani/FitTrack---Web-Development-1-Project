import { User } from "../Data/User.js";

let lastButton = document.querySelector(".home");
let selectionDiv = document.querySelector(".selection-div");
let nameSpan = document.querySelector(".profile-username-span");

fillInfo();
addNavButtonsEventListener();
addLogoutEventListener();

function addNavButtonsEventListener() {
  document.querySelectorAll(".nav-button.sup").forEach((button) => {
    button.addEventListener("click", () => {
      selectButton(button);
      lastButton?.classList.remove("hover-disabled");

      lastButton = button;
    });
  });
}

function selectButton(button) {
  if (button.dataset.index && selectionDiv) {
    selectionDiv.style.top = 20 + 70 * Number(button.dataset.index) + "px";
  }
}

function addLogoutEventListener() {
  document.querySelector(".logout")?.addEventListener("click", () => {
    localStorage.removeItem("savedUserID");
    sessionStorage.removeItem("savedUserID");

    document
      .querySelector(".loading-div")
      ?.classList.add("loading-div-running");

    setTimeout(() => {
      window.location.replace("/login");
    }, 1000);
  });
}

function fillInfo() {
  const userSession = sessionStorage.getItem("currentUser");
  const user = User.createInstance(JSON.parse(userSession));
  nameSpan.textContent = user.name;
}
