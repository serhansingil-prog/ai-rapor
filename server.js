import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// Ana sayfa
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API endpoint
app.post("/ask", (req, res) => {
  const { question } = req.body;

  if (!question || question.trim() === "") {
    return res.json({ answer: "Lütfen bir soru yaz." });
  }

  res.json({
    answer: `Soru başarıyla alındı:\n\n"${question}"`
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
