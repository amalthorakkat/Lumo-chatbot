const { GoogleGenerativeAI } = require("@google/generative-ai");
const ChatSession = require("../models/ChatSession");
const mongoose = require("mongoose");

if (!process.env.GEMINI_API_KEY) {
  console.error("FATAL: GEMINI_API_KEY is not set in environment variables.");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const startNewChat = async (req, res) => {
  try {
    console.log("Starting new chat for user:", req.user.userId);
    const session = new ChatSession({
      userId: req.user.userId,
      title: "New Chat",
    });
    await session.save();
    console.log("New session created:", session._id);
    res.json({ sessionId: session._id, title: session.title });
  } catch (error) {
    console.error("Start New Chat Error:", error.message);
    res
      .status(500)
      .json({ message: "Error starting new chat", error: error.message });
  }
};

const sendMessage = async (req, res) => {
  const { message, sessionId } = req.body;
  console.log(
    `Send Message Request: sessionId=${sessionId}, userId=${req.user?.userId}, message=${message}`
  );

  if (!process.env.GEMINI_API_KEY) {
    console.error("Missing GEMINI_API_KEY");
    return res.status(500).json({
      message: "Gemini API key is missing from server configuration.",
      error: "Configuration Error",
    });
  }

  if (
    !sessionId ||
    !message ||
    typeof message !== "string" ||
    message.trim().length === 0
  ) {
    console.error(`Invalid input: sessionId=${sessionId}, message=${message}`);
    return res
      .status(400)
      .json({ message: "Session ID and valid message are required" });
  }

  if (!mongoose.isValidObjectId(sessionId)) {
    console.error(`Invalid session ID: ${sessionId}`);
    return res.status(400).json({ message: "Invalid session ID" });
  }

  try {
    if (!req.user?.userId) {
      console.error("No user ID found in request");
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID provided" });
    }

    const session = await ChatSession.findById(sessionId);
    console.log(
      `Session query result: ${
        session
          ? JSON.stringify({
              id: session._id,
              userId: session.userId.toString(),
            })
          : "null"
      }`
    );

    if (!session) {
      console.error(`Session not found: ${sessionId}`);
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.userId.toString() !== req.user.userId) {
      console.error(
        `Unauthorized: Session userId ${session.userId.toString()} does not match req.user.userId ${
          req.user.userId
        }`
      );
      return res
        .status(403)
        .json({ message: "Unauthorized: User does not own this session" });
    }

    // Add the user's new message to the session
    session.messages.push({ sender: "user", text: message });

    let reply;
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // Construct conversation history for Gemini API
      const history = session.messages.slice(0, -1).map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

      // Include the current message in the prompt
      const chat = model.startChat({
        history,
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      reply = response.text();
    } catch (error) {
      console.error("Gemini API error:", error.message);
      if (error.message.includes("404 Not Found")) {
        reply = "The AI model is not available. Your message has been saved.";
      } else if (error.message.includes("503 Service Unavailable")) {
        reply =
          "The AI service is temporarily unavailable. Your message has been saved.";
      } else {
        reply =
          "Sorry, I couldn’t process your request. Please try again later.";
      }
      session.messages.push({ sender: "bot", text: reply });
      await session.save();
      return res.status(error.message.includes("503") ? 503 : 500).json({
        message: reply,
        sessionId,
        title: session.title,
      });
    }

    // Add the bot's reply to the session
    session.messages.push({ sender: "bot", text: reply });

    // Update session title if this is the first user message
    if (session.messages.length === 2) {
      session.title =
        message.substring(0, 30) + (message.length > 30 ? "..." : "");
    }
    await session.save();

    res.json({ reply, sessionId, title: session.title });
  } catch (error) {
    console.error("Send Message Error:", error.message);
    res
      .status(500)
      .json({ message: "Error processing message", error: error.message });
  }
};

const getChatSessions = async (req, res) => {
  try {
    console.log(`Fetching sessions for userId: ${req.user.userId}`);
    const sessions = await ChatSession.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });
    console.log(`Found ${sessions.length} sessions:`, sessions);
    res.json(sessions);
  } catch (error) {
    console.error("Get Chat Sessions Error:", error.message);
    res.status(500).json({
      message: "Error retrieving chat sessions",
      error: error.message,
    });
  }
};

const deleteChatSession = async (req, res) => {
  const { sessionId } = req.params;
  console.log(
    `Attempting to delete session: ${sessionId} for user: ${req.user?.userId}`
  );

  if (!mongoose.isValidObjectId(sessionId)) {
    console.error(`Invalid session ID: ${sessionId}`);
    return res.status(400).json({ message: "Invalid session ID" });
  }

  try {
    if (!req.user?.userId) {
      console.error("No user ID found in request");
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID provided" });
    }

    const session = await ChatSession.findById(sessionId);
    console.log(
      `Session query result: ${session ? JSON.stringify(session) : "null"}`
    );

    if (!session) {
      console.error(`Session not found: ${sessionId}`);
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.userId.toString() !== req.user.userId) {
      console.error(
        `Unauthorized: Session userId ${session.userId} does not match req.user.userId ${req.user.userId}`
      );
      return res
        .status(403)
        .json({ message: "Unauthorized: User does not own this session" });
    }

    await ChatSession.deleteOne({ _id: sessionId });
    console.log(`Session deleted successfully: ${sessionId}`);
    res.json({ message: "Chat session deleted" });
  } catch (error) {
    console.error("Delete Chat Session Error:", error.message);
    res
      .status(500)
      .json({ message: "Error deleting chat session", error: error.message });
  }
};

const updateSessionTitle = async (req, res) => {
  const { sessionId } = req.params;
  const { title } = req.body;

  if (!mongoose.isValidObjectId(sessionId)) {
    return res.status(400).json({ message: "Invalid session ID" });
  }
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return res.status(400).json({ message: "Valid title is required" });
  }

  try {
    const session = await ChatSession.findById(sessionId);
    if (!session || session.userId.toString() !== req.user.userId) {
      return res
        .status(404)
        .json({ message: "Session not found or unauthorized" });
    }
    session.title = title.trim();
    await session.save();
    res.json({ message: "Session title updated", title: session.title });
  } catch (error) {
    console.error("Update Session Title Error:", error.message);
    res
      .status(500)
      .json({ message: "Error updating session title", error: error.message });
  }
};

module.exports = {
  startNewChat,
  sendMessage,
  getChatSessions,
  deleteChatSession,
  updateSessionTitle,
};
