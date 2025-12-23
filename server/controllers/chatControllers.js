const { GoogleGenerativeAI } = require("@google/generative-ai");
const ChatSession = require("../models/ChatSession");
const mongoose = require("mongoose");

if (!process.env.GEMINI_API_KEY) {
  console.error("FATAL: GEMINI_API_KEY is not set in environment variables.");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_INSTRUCTION = `You are Lumo, a professional, intelligent, and highly capable AI assistant.
Your goal is to provide perfect, accurate, and well-structured responses that WOW the user.

**Formatting Guidelines (Strictly Follow):**
1.  **Structure**: Use Markdown headers (###) to organize your response logically.
2.  **Emphasis**: Use **Bold** for key concepts, names, metrics, or important terms.
3.  **Lists**: Use bullet points or numbered lists for clarity when presenting multiple items or steps.
4.  **Code**: Use valid Markdown code blocks for any code snippets (e.g., \`\`\`javascript ... \`\`\`).
5.  **Conciseness**: Be direct and professional. Avoid verbosity but ensure the answer is comprehensive.

**Tone**:
*   Professional, helpful, and polite.
*    confident but humble.

Ensure your entire response is complete and never cut off.`;

const startNewChat = async (req, res) => {
  try {
    const session = new ChatSession({
      userId: req.user.userId,
      title: "New Chat",
    });
    await session.save();
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

  if (
    !sessionId ||
    !message ||
    typeof message !== "string" ||
    message.trim().length === 0
  ) {
    return res
      .status(400)
      .json({ message: "Session ID and valid message are required" });
  }

  if (!mongoose.isValidObjectId(sessionId)) {
    return res.status(400).json({ message: "Invalid session ID" });
  }

  if (!req.user?.userId) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No user ID provided" });
  }

  let session;
  try {
    session = await ChatSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.userId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: User does not own this session" });
    }

    // Add user message
    session.messages.push({ sender: "user", text: message });
  } catch (error) {
    console.error("Database Error (Session Retrieval):", error.message);
    return res.status(500).json({
      message: "Database error while retrieving session",
      error: error.message,
    });
  }

  let reply;
  try {
    // Initialize model with system instruction
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const history = session.messages.slice(0, -1).map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    reply = response.text();
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    if (error.message.includes("404 Not Found")) {
      reply =
        "I apologize, but I am currently unavailable. Please try again later.";
    } else if (error.message.includes("503 Service Unavailable")) {
      reply = "Service is temporarily busy. Please try again in a moment.";
    } else {
      reply =
        "I encountered an error processing your request. Please try again.";
    }

    // Save error message to simple flow
    session.messages.push({ sender: "bot", text: reply });
    await session.save();

    return res.status(error.message.includes("503") ? 503 : 500).json({
      message: reply,
      sessionId,
      title: session.title,
    });
  }

  // Save successful response
  try {
    session.messages.push({ sender: "bot", text: reply });

    // Generate intelligent title for new chats
    if (session.messages.length === 2) {
      // Simple title generation
      session.title =
        message.length > 30 ? message.substring(0, 30) + "..." : message;
    }

    await session.save();
    res.json({ reply, sessionId, title: session.title });
  } catch (error) {
    console.error("Database Error (Saving session):", error.message);
    return res.status(500).json({
      message: "Failed to save chat session",
      error: error.message,
    });
  }
};

const getChatSessions = async (req, res) => {
  try {
    const sessions = await ChatSession.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });
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

  if (!mongoose.isValidObjectId(sessionId)) {
    return res.status(400).json({ message: "Invalid session ID" });
  }

  try {
    const session = await ChatSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await ChatSession.deleteOne({ _id: sessionId });
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
