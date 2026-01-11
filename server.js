import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// index.html'i root'tan servis et
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.json({ answer: "Soru boş gönderildi." });
  }

  res.json({
    answer: `Soru başarıyla alındı:\n\n"${question}"`
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
