const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  socketId: { type: String },
  score: { type: Number, default: 0 },
  connected: { type: Boolean, default: true },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      selectedOption: { type: Number },
      isCorrect: { type: Boolean },
      points: { type: Number, default: 0 },
      answeredAt: { type: Date, default: Date.now },
      late: { type: Boolean, default: false },
    },
  ],
});

const gameRoomSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    players: [playerSchema],
    state: {
      type: String,
      enum: ["waiting", "running", "finished"],
      default: "waiting",
    },
    currentQuestionIndex: { type: Number, default: 0 },
    settings: {
      perQuestionTime: { type: Number, default: 30 },
      shuffle: { type: Boolean, default: true },
    },
    startedAt: { type: Date },
    finishedAt: { type: Date },
  },
  { timestamps: true }
);

const GameRoom = mongoose.model("GameRoom", gameRoomSchema);
module.exports = GameRoom;
