const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

// Ana sayfa
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "chat.html"));
});

// API endpoint
app.post("/ask", (req, res) => {
  const { question } = req.body;

  res.json({
    answer: "Sorun alındı: " + question
  });
});

// Render için PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
