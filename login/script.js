import { User } from "../Data/User.js";
import { validateEmailWithMessage } from "../Data/util/emailManager.js";
import { validatePasswordWithMessage } from "../Data/util/passwordManager.js";

const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");

const emailValidationSpan = document.getElementById("email-validation");
const passwordValidationSpan = document.getElementById("password-validation");

const form = document.getElementsByTagName("form")?.[0];
const loginValidationSpan = document.getElementById("login-validation");

const rememberMeInput = document.getElementById("remember-me-input");

autoLogin();
addInputsListeners();
addFormListener();

function autoLogin() {
  const savedUserID = localStorage.getItem("savedUserID");
  if (savedUserID) {
    const user = User.getUserByID(Number(savedUserID));

    sessionStorage.setItem("currentUser", JSON.stringify({ ...user }));
    window.location.href = "/workouts";
  }
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

function addInputsListeners() {
  passwordInput.addEventListener("input", (e) => {
    validatePassword(passwordInput.value);
  });

  emailInput.addEventListener("input", (e) => {
    validateEmail(emailInput.value);
  });
}

function addFormListener() {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateEmail(emailInput.value)) {
      setFailedAnimation(emailInput);
      return;
    }

    if (!validatePassword(passwordInput.value)) {
      setFailedAnimation(passwordInput);
      return;
    }

    const user = User.findUserByEmailAndPassword(
      emailInput.value,
      passwordInput.value,
    );

    if (user) {
      loginValidationSpan.textContent = "";
      sessionStorage.setItem("currentUser", JSON.stringify({ ...user }));

      if (rememberMeInput.checked) {
        localStorage.setItem("savedUserID", "" + user.id);
      } else localStorage.removeItem("savedUserID");

      window.location.href = "/workouts";
    } else {
      loginValidationSpan.textContent = "Invalid Email and/or Password";

      loginFailedAnimation();
    }
    e.preventDefault();
  });
}

function setFailedAnimation(element) {
  element?.classList.add("failed", "failed-animation");
  setTimeout(() => element?.classList.remove("failed-animation"), 300);
}

function loginFailedAnimation() {
  emailInput?.classList.add("failed", "failed-animation");
  passwordInput?.classList.add("failed", "failed-animation");

  setTimeout(() => {
    emailInput?.classList.remove("failed-animation");
    passwordInput?.classList.remove("failed-animation");
  }, 300);
}

document.getElementById("register").addEventListener("click", () => {
  window.location.replace("/register");
});
