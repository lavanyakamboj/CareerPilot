const User = require("../models/User");
const { verifyToken } = require("../utils/jwtUtils");
const { isTokenBlacklisted } = require("../utils/tokenBlacklist");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    if (isTokenBlacklisted(token)) {
      return res.status(401).json({
        message: "Session expired. Please log in again.",
      });
    }

    const decoded = verifyToken(token);

    req.user = await User.findById(decoded.id).select(
      "-password +passwordChangedAt",
    );

    if (!req.user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // Agar password token issue hone ke BAAD change hui hai (e.g. reset
    // password flow se), to yeh purana token ab invalid maana jaata hai
    // — attacker ke paas agar purana leaked token ho, wo kaam nahi karega.
    if (req.user.passwordChangedAt) {
      const passwordChangedAtSeconds = Math.floor(
        req.user.passwordChangedAt.getTime() / 1000,
      );

      if (decoded.iat < passwordChangedAtSeconds) {
        return res.status(401).json({
          message: "Session expired due to a recent password change. Please log in again.",
        });
      }
    }

    req.token = token;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};

module.exports = { protect };
