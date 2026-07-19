const crypto = require("crypto");

/**
 * Ek cryptographically random raw token banata hai (email link ke liye)
 * — raw token sirf user ko bheja jaata hai (email mein), DB mein iska
 * SHA-256 hash store hota hai. Isse agar DB leak bhi ho jaaye, attacker
 * asli token reconstruct nahi kar sakta (jaise passwords hashed hote hain).
 */
const generateRawToken = () => crypto.randomBytes(32).toString("hex");

const hashToken = (rawToken) =>
  crypto.createHash("sha256").update(rawToken).digest("hex");

/**
 * 6-digit numeric OTP — forgot-password ke liye (link ke alawa ek aasan
 * option, especially mobile users ke liye).
 */
const generateOtp = () =>
  crypto.randomInt(100000, 999999).toString();

module.exports = { generateRawToken, hashToken, generateOtp };
