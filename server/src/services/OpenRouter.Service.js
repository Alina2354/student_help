const axios = require("axios");

class OpenRouterService {
  static async ask(userQuery) {
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "deepseek/deepseek-chat",
          temperature: 0.7,
          messages: [
            {
              role: "system",
              content:
                `Ты помощник для студентов. Твоя задача - помогать студентам находить информацию о преподавателях, дисциплинах и отвечать на вопросы об учебе. не в коем случае не отвечай мне , что такое сук! говори я не знаю!

Если студент спрашивает о преподавателе или дисциплине, сначала попробуй найти информацию через поиск. Если не найдено, дай общий ответ.

Будь дружелюбным, полезным и информативным. Отвечай на русском языке.`.trim(),
            },
            {
              role: "user",
              content: userQuery,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
            "X-Title": "Student-Assistant",
            "Content-Type": "application/json",
          },
        }
      );

      // Извлекаем и чистим ответ
      const content = response.data.choices[0].message.content.trim();
      return content;
    } catch (err) {
      console.error(
        "Ошибка OpenRouter API:",
        err.response?.data || err.message
      );
      throw new Error("Ошибка при запросе к OpenRouter API");
    }
  }
}

module.exports = OpenRouterService;
