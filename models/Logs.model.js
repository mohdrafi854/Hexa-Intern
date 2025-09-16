const mongoose = require("mongoose");

const logSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:false,
        default:null,
    },
    actionType:{
        type:String,
        required:true,
    },
    timestamp:{
        type:Date,
        required:true,
        default:Date.now
    },
    ipAddress:{
        type:String,
        required:true,
    },
    timestamp: { type: Date, default: Date.now },
})

logSchema.index({timestamp:1})
logSchema.index({userId:1})
logSchema.index({actionType:1})

module.exports = mongoose.model('Log', logSchema);