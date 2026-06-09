const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

// Check if API key is loaded
console.log("API Key Loaded:", !!process.env.GEMINI_API_KEY);
console.log(
  "API Key Prefix:",
  process.env.GEMINI_API_KEY?.substring(0, 10)
);

const app = express();

app.use(cors());
app.use(express.json());

// Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.send("AI Interview Generator Backend Running 🚀");
});

// ==========================================
// CHECK API KEY ROUTE
// ==========================================

app.get("/check-key", (req, res) => {
  res.json({
    keyLoaded: !!process.env.GEMINI_API_KEY,
    prefix: process.env.GEMINI_API_KEY?.substring(0, 10),
  });
});

// ==========================================
// TEST GEMINI ROUTE
// ==========================================

app.get("/test-ai", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent("Say Hello");

    res.json({
      success: true,
      data: result.response.text(),
    });
  } catch (error) {
    console.error("TEST AI ERROR:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// GENERATE INTERVIEW QUESTIONS
// ==========================================

app.post("/generate", async (req, res) => {
  try {
    const { role, difficulty, count } = req.body;

    if (!role || !difficulty || !count) {
      return res.status(400).json({
        success: false,
        message: "role, difficulty and count are required",
      });
    }

    console.log("Request Received:", {
      role,
      difficulty,
      count,
    });

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
Generate ${count} ${difficulty} interview questions for the role "${role}".

For each question provide:

1. Question
2. Answer
3. Explanation

Keep the response clean and professional.
`;

    const result = await model.generateContent(prompt);

    res.json({
      success: true,
      data: result.response.text(),
    });
  } catch (error) {
    console.error("GENERATE ERROR:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});