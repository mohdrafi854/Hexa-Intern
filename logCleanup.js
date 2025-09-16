const Log = require('./logs.model');
const cutoffDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

async function cleanupLogs() {
  const result = await Log.deleteMany({ timestamp: { $lt: cutoffDate } });
  console.log(`Deleted ${result.deletedCount} logs.`);
}

cleanupLogs().then(() => process.exit());