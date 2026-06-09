import { useState } from "react";
import { jsPDF } from "jspdf";

function App() {
  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [count, setCount] = useState(5);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generateQuestions = async () => {
    try {
      setLoading(true);

      const response = await fetch("https://name-ai-interview-generator-backend.onrender.com/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          difficulty,
          count,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        alert("Failed to generate questions");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  const copyQuestions = () => {
    navigator.clipboard.writeText(result);
    alert("Questions copied successfully!");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    const lines = doc.splitTextToSize(result, 180);

    doc.text(lines, 10, 10);

    doc.save("AI_Interview_Questions.pdf");
  };

  return (
    <div className="container">
      <h1>AI Interview Question Generator 🚀</h1>

      <input
        type="text"
        placeholder="Enter Job Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <input
        type="number"
        min="1"
        max="20"
        value={count}
        onChange={(e) => setCount(e.target.value)}
      />

      <button
        onClick={generateQuestions}
        disabled={loading}
      >
        {loading ? "⏳ Generating..." : "🚀 Generate Questions"}
      </button>

      {result && (
        <div className="result">
          <button onClick={copyQuestions}>
            📋 Copy Questions
          </button>

          <button onClick={downloadPDF}>
            📄 Download PDF
          </button>

          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}

export default App;