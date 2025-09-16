const express = require("express");
const router = express.Router();
const Log = require("../models/Logs.model")

router.post("/logs", async (req, res) => {
  try {
    const log = new Log(req.body);
    await log.save();
    res.status(201).json({ messae: "Logs create Successfully", log });
  } catch (error) {
    res.status(400).json({ error: "Something went Wrong!" });
  }
});

router.get("/logs", async (req, res) => {
  const { userId, actionType, from, to } = req.query;
  let filter = {};
  if (userId) {
    filter.userId = userId;
  }
  if (actionType) {
    filter.actionType = actionType;
  }
  if (from || to) {
    filter.timestamp = {};
    if (from) filter.timestamp.$gte = new Date(from);
    if (to) filter.timestamp.$lte = new Date(to);
  }
  try {
    const logs = await Log.find(filter).sort({ timestamp: -1 });
    res.status(201).json({ message: "Filter successfully", logs });
  } catch (error) {
    console.error(error.messae);
    res.status(500).json({ error: "Something Went Wrong" });
  }
});

router.get("/analytics/active-users", async (req, res) => {
  try {
    const activeUsers = await Log.aggregate([
      { $group: { _id: "$userId", logCount: { $sum: 1 } } },
      { $sort: { logCount: -1 } },
      { $limit: 10 },
    ]);
    res.status(201).json({ message: "I have found active users", activeUsers });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get("/analytics/peak-hours", async (req, res) => {
  try {
    const peakHours = await Log.aggregate([
      {
        $group: {
          _id: { $hour: "$timestamp" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 3 },
    ]);
    res
      .status(201)
      .json({ message: "Peak Hours fetch successfully", peakHours });
  } catch (error) {
    console.error({ error: error.message });
    res.status(500).json({ error: error.message });
  }
});

router.get("/dashboard/summary", async (req, res) => {
  try {
    const totalLogs = await Log.countDocuments();
    const uniqueUsers = await Log.distinct("userId");
    const topActions = Log.aggregate([
      { $group: { _id: "$actionType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.status(201).json({totalLogs, uniqueUsers:uniqueUsers.length, topActions})
  } catch (error) {
    res.status(500).json({error:error.message})
  }
});

module.exports = router