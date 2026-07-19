const sanitizeObjectInPlace = (obj) => {
  if (!obj || typeof obj !== "object") return;

  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
      continue;
    }

    const value = obj[key];

    if (value && typeof value === "object") {
      sanitizeObjectInPlace(value);
    }
  }
};

const mongoSanitizeMiddleware = (req, res, next) => {
  sanitizeObjectInPlace(req.body);
  sanitizeObjectInPlace(req.query);
  sanitizeObjectInPlace(req.params);

  next();
};

module.exports = { mongoSanitizeMiddleware };