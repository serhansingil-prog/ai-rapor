const express = require("express");
const path = require("path");
const fetch = require("node-fetch");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "chat.html"));
});

app.post("/ask", async (req, res) => {
  const { question } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Sen profesyonel bir iş analisti ve rapor yazarı gibi Türkçe cevap ver."
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.3
      })
    });

    const data = await response.json();

    const answer = data.choices?.[0]?.message?.content || "Cevap alınamadı.";

    res.json({ answer });

  } catch (error) {
    console.error(error);
    res.json({ answer: "Bir hata oluştu." });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
