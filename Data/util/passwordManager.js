export function validatePasswordWithMessage(password) {
  if (typeof password !== "string") return "Password is not a string";

  if (password.length < 8) return "Minimum password length is 8";

  let hasUppercase = false;
  let hasLowerCase = false;
  let hasDigit = false;
  let hasSpecial = false;

  for (const char of password) {
    if (hasUppercase && hasLowerCase && hasDigit && hasSpecial) break;

    if (char >= "a" && char <= "z") {
      hasLowerCase = true;
      continue;
    }

    if (char >= "A" && char <= "Z") {
      hasUpperCase = true;
      continue;
    }

    if (char >= "0" && char <= "9") {
      hasDigit = true;
      continue;
    }

    hasSpecial = true;
  }

  if (!hasUppercase) return "Password must have an uppercase letter";
  if (!hasLowerCase) return "Password must have an lowercase letter";
  if (!hasDigit) return "Password must have a digit";
  if (!hasSpecial) return "Password must have an special character";

  return "Valid";
}

export function validatePassword(password) {
  return validatePasswordWithMessage(password) === "Valid";
}

export function encryptPassword(password) {
  let encrypted = "";
  for (let i = 0; i < password.length; i++) {
    const charCode = password.charCodeAt(i);
    if (i % 2 === 0) {
      encrypted += String.fromCharCode(charCode - 1);
    } else {
      encrypted += String.fromCharCode(charCode + 2);
    }
  }
  return encrypted;
}

export function decryptPassword(encrypted) {
  let decrypted = "";
  for (let i = 0; i < encrypted.length; i++) {
    const charCode = encrypted.charCodeAt(i);
    if (i % 2 === 0) {
      decrypted += String.fromCharCode(charCode + 1);
    } else {
      decrypted += String.fromCharCode(charCode - 2);
    }
  }
  return decrypted;
}
