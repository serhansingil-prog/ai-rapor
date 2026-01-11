import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "chat.html"));
});

async function askOpenAI(question) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return "OpenAI API anahtarı bulunamadı.";
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Sen Türkçe cevap veren yaratıcı bir asistansın." },
        { role: "user", content: question }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "Yanıt alınamadı.";
}

app.post("/ask", async (req, res) => {
  const { question } = req.body || {};

  if (!question || String(question).trim() === "") {
    return res.json({ answer: "Lütfen bir soru yaz." });
  }

  try {
    const answer = await askOpenAI(question);
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.json({ answer: "OpenAI bağlantısında hata oluştu." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
