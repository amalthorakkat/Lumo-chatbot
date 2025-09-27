// controllers/chatController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- CHANGE: Check for API key and initialize client once for robustness ---
if (!process.env.GEMINI_API_KEY) {
  console.error("FATAL: GEMINI_API_KEY is not set in environment variables.");
  // Throwing here will prevent the application from starting if the key is missing
  // But for a running server, we'll handle the error in sendMessage
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const sendMessage = async (req, res) => {
  const { message } = req.body; // --- CHANGE: Immediate check for missing API key/Client initialization error ---

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      message: "Gemini API key is missing from server configuration.",
      error: "Configuration Error",
    });
  }

  try {
    // Using gemini-1.5-flash which is a good, fast model for chat
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error("Gemini API error:", error.message);
    res.status(500).json({
      message: "Error communicating with Gemini API", // Returning a less specific error to the client for security
      error: error.message,
    });
  }
};

module.exports = { sendMessage };
