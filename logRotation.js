const Log = require('./models/Logs.model');
const LogArchive = require('./models/logArchive.model');


const cutoffDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

async function rotateLogs() {
  
  const oldLogs = await Log.find({ timestamp: { $lt: cutoffDate } });

  if (oldLogs.length) {
    
    await LogArchive.insertMany(oldLogs);

    
    await Log.deleteMany({ timestamp: { $lt: cutoffDate } });
    console.log(`Archived & deleted ${oldLogs.length} logs.`);
  } else {
    console.log('No logs to archive/delete.');
  }
}

rotateLogs().then(() => process.exit());