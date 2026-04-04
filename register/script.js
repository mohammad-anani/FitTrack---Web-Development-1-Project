import { User } from "../Data/User.js";
import { validateEmailWithMessage } from "../Data/util/emailManager.js";
import { validatePasswordWithMessage } from "../Data/util/passwordManager.js";

//Text Inputs
let nameInput = document.getElementById("name-input");
let emailInput = document.getElementById("email-input");
let passwordInput = document.getElementById("password-input");

//Validation spans below each input
let nameValidationSpan = document.getElementById("name-validation");
let emailValidationSpan = document.getElementById("email-validation");
let passwordValidationSpan = document.getElementById("password-validation");

let form = document.getElementsByTagName("form")?.[0];

//Validation for the form
let registerValidationSpan = document.getElementById("register-validation");

addInputsListeners();
addFormListener();

function validateName(name) {
  const isValid = name.length >= 3;
  if (!isValid) {
    nameValidationSpan.textContent = "Minimum name length is 3 characters";
    return false;
  }
  nameValidationSpan.textContent = "";
  return true;
}

function validateEmail(email) {
  const message = validateEmailWithMessage(email);
  if (message !== "Valid") {
    emailValidationSpan.textContent = message;
    return false;
  }
  emailValidationSpan.textContent = "";
  return true;
}

function validatePassword(password) {
  const message = validatePasswordWithMessage(password);
  if (message !== "Valid") {
    passwordValidationSpan.textContent = message;
    return false;
  }
  passwordValidationSpan.textContent = "";
  return true;
}

function setFailedAnimation(element) {
  element?.classList.add("failed", "failed-animation");
  setTimeout(() => element?.classList.remove("failed-animation"), 300);
}

function addInputsListeners() {
  nameInput.addEventListener("input", () => validateName(nameInput.value));
  emailInput.addEventListener("input", () => validateEmail(emailInput.value));
  passwordInput.addEventListener("input", () =>
    validatePassword(passwordInput.value),
  );
}

function addFormListener() {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateName(nameInput.value)) {
      setFailedAnimation(nameInput);
      return;
    }

    if (!validateEmail(emailInput.value)) {
      setFailedAnimation(emailInput);

      return;
    }

    if (!validatePassword(passwordInput.value)) {
      setFailedAnimation(passwordInput);
      return;
    }

    const user = new User(
      -1,
      emailInput.value,
      passwordInput.value,
      nameInput.value,
    );

    const newID = user.addUser();

    if (newID) {
      if (newID === -1) {
        setFailedAnimation(emailInput);
        registerValidationSpan.textContent = "Email already exists.";
        return;
      }

      window.location.href = "/login";
    } else {
      registerValidationSpan.textContent = "Registration failed.";
      setFailedAnimation(emailInput);
    }
  });
}
