const Logs = require("../models/Logs.model");

const loggingMiddleware = async (req, res, next) => {
  try {
    const ip = req.ip === "::1" ? "127.0.0.1" : req.ip;

    await Logs.create({
      userId: req.user?._id || null,
      actionType: req.method,
      endpoint: req.originalUrl,
      ipAddress: ip,
    });
  } catch (err) {
    console.warn("Logging failed:", err.message);
  }
  next();
};


module.exports= loggingMiddleware