export function validateEmailWithMessage(email) {
  if (typeof email !== "string") return "Email is not a string";

  const atIndex = email.indexOf("@");
  const lastAtIndex = email.lastIndexOf("@");
  const dotIndex = email.lastIndexOf(".");

  if (atIndex <= 0 || atIndex === email.length - 1) {
    return "Email must contain '@' in a valid position";
  }

  if (atIndex !== lastAtIndex) {
    return "Email cannot have more than one '@' symbol";
  }

  if (dotIndex <= atIndex + 1 || dotIndex === email.length - 1) {
    return "Email must have a valid domain (e.g., .com)";
  }

  for (const char of email) {
    if (char === " ") return "Email cannot contain spaces";
  }

  return "Valid";
}

export function validateEmail(email) {
  return validateEmailWithMessage(email) === "Valid";
}
