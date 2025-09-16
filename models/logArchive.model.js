const mongoose = require("mongoose");

const logArchiveSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  actionType: {
    type: String,
    required: true,
    enum: ["login", "logout", "update", "delete"],
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
  },
});

logArchiveSchema.index({timeStamp:1})
logArchiveSchema.index({userId:1})
logArchiveSchema.index({actionType:1})

module.exports = mongoose.model('LogArchive', logArchiveSchema)