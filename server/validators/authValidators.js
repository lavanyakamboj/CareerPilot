const { body, validationResult } = require("express-validator");

// Password rule: kam se kam 8 characters, ek uppercase, ek lowercase,
// ek number, aur ek special character (symbol).
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const passwordRule = body("password")
  .matches(PASSWORD_REGEX)
  .withMessage(
    "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.",
  );

const emailRule = body("email")
  .trim()
  .isEmail()
  .withMessage("Please provide a valid email address.")
  .normalizeEmail();

const registerValidators = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("Name must be between 2 and 80 characters.")
    .escape(), // HTML-significant characters ko encode karta hai — stored XSS se bachne ke liye
  emailRule,
  passwordRule,
];

const loginValidators = [
  emailRule,
  body("password").notEmpty().withMessage("Password is required."),
];

const forgotPasswordValidators = [emailRule];

const resetPasswordValidators = [
  body("token").optional().isString(),
  body("otp").optional().isString().isLength({ min: 6, max: 6 }),
  passwordRule.withMessage(
    "New password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.",
  ),
];

const resendVerificationValidators = [emailRule];

// Route mein har validator chain ke baad yeh middleware laga do — agar
// koi validation fail hui, request yahin 400 ke saath reject ho jaati
// hai, controller tak pahunchti hi nahi.
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }

  next();
};

module.exports = {
  registerValidators,
  loginValidators,
  forgotPasswordValidators,
  resetPasswordValidators,
  resendVerificationValidators,
  handleValidationErrors,
  PASSWORD_REGEX,
};
