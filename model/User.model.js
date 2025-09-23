const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:false,
    },
    email:{
        type:String,
        required:false,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,

    },
    avatar:{
        type:String,
    },
    totalGamesPlayed:{
        type:Number,
        default:0,
    },
    winRate:{
        type:Number,
        default:0,
    }
}, {timestamps:true})

const User = new mongoose.model("User", userSchema);
module.exports = User