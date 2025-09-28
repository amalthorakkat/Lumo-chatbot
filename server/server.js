require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://lumo-chatbot-cju07m72f-amal-thorakkats-projects.vercel.app",
      "https://lumo-chatbot-git-main-amal-thorakkats-projects.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/test", (req, res) => res.json({ message: "Server is alive" }));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on PORT : ${PORT}`));
