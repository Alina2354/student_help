const express = require("express");
const OpenRouterService = require("../services/OpenRouter.Service");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Поле message обязательно" });
    }

    const reply = await OpenRouterService.ask(message);

    res.json({ reply });
  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ error: "Ошибка при обращении к AI" });
  }
});

module.exports = router;
