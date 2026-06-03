const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Gemini Configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", (req, res) => {
    res.send("AI Interview Generator Backend Running 🚀");
});

// ==========================================
// TEST GEMINI ROUTE
// ==========================================

app.get("/test-ai", async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const result = await model.generateContent(
            "Generate one software testing interview question with answer."
        );

        const response = result.response.text();

        res.json({
            success: true,
            data: response
        });

    } catch (error) {
        console.error("Gemini Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ==========================================
// GENERATE INTERVIEW QUESTIONS
// ==========================================

app.post("/generate", async (req, res) => {
    try {

        const { role, difficulty, count } = req.body;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const prompt = `
Generate ${count} ${difficulty} level interview questions for the role "${role}".

For each question provide:

1. Question
2. Answer
3. Explanation

Format the response clearly.
`;

        const result = await model.generateContent(prompt);

        const response = result.response.text();

        res.json({
            success: true,
            data: response
        });

    } catch (error) {

        console.error("Generate Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});