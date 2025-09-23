const express = require("express");
require("dotenv").config();
const app = express();

const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const GameRoom = require("./model/GameRoom.model");
const Quiz = require("./model/Quiz.model");
const Question = require("./model/Question.model");

app.use(express.json());
const { InitializeDatabase } = require("./db/db.connect");

InitializeDatabase();

const authRoutes = require("./routes/auth.routes");
const quiz = require("./routes/quiz.routes");
const question = require("./routes/question.routes");

app.use("/api/v1/", authRoutes);
app.use("/api/v1/", quiz);
app.use("/api/v1/", question);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const rooms = new Map();

function getLeaderboard(room) {
  return room.players
    .map((p) => ({ name: p.name, score: p.score }))
    .sort((a, b) => b.score - a.score);
}

io.on("connection", (socket) => {
  console.log("New socket connected:", socket.id);

  socket.on("join-room", async ({ code, name, userId }, cb) => {
    let room = rooms.get(code);
    if (!room) return cb({ error: "Room not found" });

    if (userId && room.players.find((p) => p.userId?.toString() === userId)) {
      return cb({ error: "User already connected in this room" });
    }

    const player = {
      socketId: socket.id,
      name,
      userId,
      score: 0,
      connected: true,
      answers: [],
    };
    room.players.push(player);
    socket.join(code);
    io.to(code).emit("player-joined", {
      player,
      leaderboard: getLeaderboard(room),
    });
    cb({ ok: true, playerId: socket.id });
  });

  socket.on("start-quiz", async ({ code }, cb) => {
    let room = rooms.get(code);
    if (!room) return cb({ error: "Room not found" });

    const questions = await Question.find({ quiz: room.quiz }).lean();
    if (room.settings.shuffle) {
      room.questions = questions.sort(() => Math.random() - 0.5);
    } else {
      room.questions = questions;
    }

    room.state = "running";
    room.currentQuestionIndex = 0;
    room.startedAt = new Date();
    io.to(code).emit("quiz-started", { totalQuestions: room.questions.length });
    sendQuestion(code);
    cb({ ok: true });
  });

  socket.on("submit-answer", ({ code, questionId, selectedIndex }, cb) => {
    let room = rooms.get(code);
    if (!room) return cb({ error: "Room not found" });

    const player = room.players.find((p) => p.socketId === socket.id);
    if (!player) return cb({ error: "Player not found in room" });

    const question = room.questions.find((q) => String(q._id) === questionId);
    if (!question) return cb({ error: "Question not found" });

    if (player.answers.find((a) => String(a.questionId) === questionId)) {
      return cb({ error: "Already answered" });
    }

    const now = Date.now();
    const elapsed = (now - room.currentQuestionSentAt) / 1000;
    const isLate = elapsed > (room.settings.perQuestionTime || 30);

    const isCorrect = question.options[selectedIndex]?.isCorrect || false;
    const timeRemaining = Math.max(
      0,
      (room.settings.perQuestionTime || 30) - elapsed
    );

    let points = 0;
    if (isCorrect && !isLate) {
      points = Math.round(
        100 + (timeRemaining / (room.settings.perQuestionTime || 30)) * 50
      );
      player.score += points;
    } else if (isLate) {
      points = 0;
    }

    player.answers.push({
      questionId,
      selectedOption: selectedIndex,
      isCorrect,
      points,
      late: isLate,
    });
    io.to(code).emit("player-update", {
      playerId: socket.id,
      score: player.score,
      leaderboard: getLeaderboard(room),
    });
    cb({ ok: true, isCorrect, points, late: isLate });
  });

  socket.on("disconnect", () => {
    for (let [code, room] of rooms.entries()) {
      const idx = room.players.findIndex((p) => p.socketId === socket.id);
      if (idx !== -1) {
        const left = room.players.splice(idx, 1)[0];
        io.to(code).emit("player-left", {
          playerId: socket.id,
          name: left.name,
        });
      }
    }
  });

  async function sendQuestion(code) {
    const room = rooms.get(code);
    if (!room) return;
    if (room.currentQuestionIndex >= room.questions.length) {
      room.state = "finished";
      room.finishedAt = new Date();
      io.to(code).emit("quiz-finished", { leaderboard: getLeaderboard(room) });
      return;
    }

    const q = room.questions[room.currentQuestionIndex];
    const payload = {
      questionId: q._id,
      index: room.currentQuestionIndex,
      questionText: q.questionText,
      options: q.options.map((o) => ({ text: o.text })),
      timeLimit: room.settings.perQuestionTime || 30,
      sentAt: Date.now(),
    };

    room.currentQuestionSentAt = payload.sentAt;
    io.to(code).emit("question", payload);

    setTimeout(() => {
      io.to(code).emit("question-ended", {
        index: room.currentQuestionIndex,
        leaderboard: getLeaderboard(room),
      });
      room.currentQuestionIndex++;
      sendQuestion(code);
    }, payload.timeLimit * 1000);
  }
});

app.get("/", (req, res) => {
  res.send("Server Start");
});

app.listen(process.env.PORT, () => {
  console.log(`server running start ${process.env.PORT}`);
});
