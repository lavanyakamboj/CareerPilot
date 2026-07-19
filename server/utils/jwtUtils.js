const jwt = require("jsonwebtoken");

const ISSUER = "careerpilot-api";
const AUDIENCE = "careerpilot-client";
const ALGORITHM = "HS256";

/**
 * Token sign karta hai with explicit algorithm + issuer/audience claims.
 * Explicit algorithm set karna zaroori hai — warna "algorithm confusion"
 * attack possible hota hai (attacker RS256 se signed token ko HS256
 * treat karwa ke public key ko hi secret bana sakta hai, agar verify
 * side algorithm restrict na ho).
 */
const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: ALGORITHM,
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    issuer: ISSUER,
    audience: AUDIENCE,
  });

const verifyToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: [ALGORITHM],
    issuer: ISSUER,
    audience: AUDIENCE,
  });

module.exports = { signToken, verifyToken };
