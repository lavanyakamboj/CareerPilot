// Backend (server/validators/authValidators.js) ke PASSWORD_REGEX se
// exactly match karta hai — taaki user ko client par hi turant pata chal
// jaaye ki password valid hai ya nahi, server round-trip se pehle.
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const PASSWORD_HINT =
  "At least 8 characters, with an uppercase letter, a lowercase letter, a number, and a special character.";

export const getPasswordChecklist = (password = "") => [
  { label: "At least 8 characters", met: password.length >= 8 },
  { label: "One uppercase letter", met: /[A-Z]/.test(password) },
  { label: "One lowercase letter", met: /[a-z]/.test(password) },
  { label: "One number", met: /\d/.test(password) },
  { label: "One special character", met: /[^A-Za-z0-9]/.test(password) },
];

export const isPasswordValid = (password = "") => PASSWORD_REGEX.test(password);
