const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const sendMessage = async (req, res) => {
  const { message } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    res.status(500).json({ message: 'Error communicating with Gemini API', error: error.message });
  }
};

module.exports = { sendMessage };