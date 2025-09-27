const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  startNewChat,
  sendMessage,
  getChatSessions,
  deleteChatSession,
  updateSessionTitle,
} = require("../controllers/chatControllers");

router.post("/new", authMiddleware, startNewChat);
router.post("/message", authMiddleware, sendMessage);
router.get("/sessions", authMiddleware, getChatSessions);
router.delete("/session/:sessionId", authMiddleware, deleteChatSession);
router.put("/session/:sessionId", authMiddleware, updateSessionTitle);

module.exports = router;
