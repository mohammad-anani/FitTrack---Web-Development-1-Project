import { User } from "../Data/User.js";
import { validateEmailWithMessage } from "../Data/util/emailManager.js";
import { validatePasswordWithMessage } from "../Data/util/passwordManager.js";

let emailInput = document.getElementById("email");
let passwordInput = document.getElementById("password");
let emailValidationSpan = document.getElementById("emailValidation");
let passwordValidationSpan = document.getElementById("passwordValidation");
let form = document.getElementById("form");
let loginFailedSpan = document.getElementById("loginFailed");
let rememberMeInput = document.getElementById("rememberMe");
const savedUserID = localStorage.getItem("savedUserID");
if (savedUserID) {
  rememberMeInput.checked = true;
  const user = User.getUserByID(Number(savedUserID));

  sessionStorage.setItem("currentUser", JSON.stringify({ ...user }));
  window.location.href = "/workouts";
}

passwordInput.addEventListener("input", (e) => {
  const message = validatePasswordWithMessage(passwordInput.value);

  if (message !== "Valid") passwordValidationSpan.textContent = message;
  else passwordValidationSpan.textContent = "";
});

emailInput.addEventListener("input", (e) => {
  const message = validateEmailWithMessage(emailInput.value);

  if (message !== "Valid") emailValidationSpan.textContent = message;
  else emailValidationSpan.textContent = "";
});

form.addEventListener("submit", (e) => {
  const valid =
    emailValidationSpan.textContent === "" &&
    passwordValidationSpan.textContent === "";

  if (!valid) return;

  const user = User.findUserByEmailAndPassword(
    emailInput.value,
    passwordInput.value,
  );

  if (user) {
    loginFailedSpan.textContent = "";
    sessionStorage.setItem("currentUser", JSON.stringify({ ...user }));

    if (rememberMeInput.checked) {
      localStorage.setItem("savedUserID", "" + user.id);
    } else localStorage.removeItem("savedUserID");

    window.location.href = "/workouts";
  } else {
    loginFailedSpan.textContent = "Failed";
  }

  e.preventDefault();
});
