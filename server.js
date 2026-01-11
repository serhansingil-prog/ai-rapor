const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_KEY = process.env.OPENAI_KEY;
const SHEET_ID = "1dH3YWTg8xsf8k0BN7pD0ju85_G9In2zdcAw9ZIPr2O4";

app.post("/ask", async (req, res) => {
  const { question } = req.body;

  try {
    // Google Sheets'ten veri çek
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;
    const sheetRes = await fetch(sheetUrl);
    const sheetData = await sheetRes.text();

    const prompt = `
Here is the latest campaign data from Google Sheets:

${sheetData}

User question (Turkish):
"${question}"

Answer in Turkish with clear insights and recommendations.
`;

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const aiData = await aiRes.json();

    res.json({
      answer: aiData?.choices?.[0]?.message?.content || "AI cevabı alınamadı."
    });

  } catch (err) {
    res.status(500).json({
      answer: "Veri veya AI hatası oluştu.",
      error: err.message
    });
  }
});

app.listen(3000, () => {
  console.log("AI Server running on http://localhost:3000");
});
