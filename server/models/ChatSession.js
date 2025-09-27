// const mongoose = require("mongoose");

// const messageSchema = new mongoose.Schema({
//   sender: {
//     type: String,
//     enum: ["user", "bot"],
//     required: true,
//   },
//   text: {
//     type: String,
//     default: Date.now,
//   },
// });

// const chatSessionSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   title: {
//     type: String,
//     default: "New Chat",
//   },
//   messages: [messageSchema],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["user", "bot"],
    required: true,
  },
  text: {
    type: String,
    required: true, // Message text should be required, not defaulted to a date.
  },
  createdAt: {
    type: Date,
    default: Date.now, // Added a proper timestamp for the message itself
  },
});

const chatSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    default: "New Chat",
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// FIX: The model export was missing, causing a server crash (500 error) when queried.
module.exports = mongoose.model("ChatSession", chatSessionSchema);
