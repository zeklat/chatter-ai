require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path"); // <-- Import path for serving static files
const { Ollama } = require("ollama");

const app = express();
const port = 5000;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, "../front/build")));

// Ollama chat API
const ollama = new Ollama({ host: "http://localhost:11434" });

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const ollamaResponse = await ollama.chat({
      model: "llama3.2:1b",
      messages: [{ role: "user", content: message }],
    });

    if (ollamaResponse?.message?.content) {
      res.json({ response: ollamaResponse.message.content });
    } else {
      res.status(500).json({ error: "No response text from Ollama" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error processing request", details: error.message || error });
  }
});

// Catch-all route to handle React routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../front/build", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
