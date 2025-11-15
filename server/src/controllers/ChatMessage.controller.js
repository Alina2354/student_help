const chatMessageService = require("../services/ChatMessage.Service");
const formatResponse = require("../utils/formatResponse");
const OpenRouterService = require("../services/OpenRouter.Service");
const teacherService = require("../services/Teacher.Service");

class ChatMessageController {
  static async getAllMessages(req, res) {
    try {
      const messages = await chatMessageService.getAllMessages();
      res.status(200).json(formatResponse(200, "Список сообщений", messages));
    } catch (error) {
      res
        .status(500)
        .json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async getMessagesByUserId(req, res) {
    try {
      const userId = req.params.userId || res.locals.user?.id;
      if (!userId) {
        return res
          .status(400)
          .json(formatResponse(400, "ID пользователя не указан"));
      }
      const messages = await chatMessageService.getMessagesByUserId(userId);
      res
        .status(200)
        .json(formatResponse(200, "Сообщения пользователя", messages));
    } catch (error) {
      res
        .status(500)
        .json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async getMyMessages(req, res) {
    try {
      const userId = res.locals.user?.id;
      if (!userId) {
        return res
          .status(401)
          .json(formatResponse(401, "Пользователь не авторизован"));
      }
      const messages = await chatMessageService.getMessagesByUserId(userId);
      res.status(200).json(formatResponse(200, "Мои сообщения", messages));
    } catch (error) {
      res
        .status(500)
        .json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async getMessageById(req, res) {
    try {
      const message = await chatMessageService.getMessageById(req.params.id);
      if (!message) {
        return res
          .status(404)
          .json(formatResponse(404, "Сообщение не найдено"));
      }
      res.status(200).json(formatResponse(200, "Сообщение найдено", message));
    } catch (error) {
      res
        .status(500)
        .json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async createMessage(req, res) {
    try {
      const { content, sender } = req.body;
      const userId = res.locals.user?.id; // Может быть undefined для неавторизованных

      if (!content || !sender) {
        return res
          .status(400)
          .json(formatResponse(400, "Контент и отправитель обязательны"));
      }

      if (!["user", "assistant"].includes(sender)) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              "Отправитель должен быть 'user' или 'assistant'"
            )
          );
      }

      // Сохраняем все сообщения, даже для неавторизованных (user_id будет null)
      const message = await chatMessageService.createMessage({
        user_id: userId || null,
        content,
        sender,
      });
      res.status(201).json(formatResponse(201, "Сообщение создано", message));
    } catch (error) {
      res
        .status(500)
        .json(
          formatResponse(
            500,
            "Ошибка при создании сообщения",
            null,
            error.message
          )
        );
    }
  }

  static async updateMessage(req, res) {
    try {
      const updated = await chatMessageService.updateMessage(
        req.params.id,
        req.body
      );
      if (!updated) {
        return res
          .status(404)
          .json(formatResponse(404, "Сообщение не найдено"));
      }
      res.status(200).json(formatResponse(200, "Сообщение обновлено", updated));
    } catch (error) {
      res
        .status(500)
        .json(
          formatResponse(
            500,
            "Ошибка при обновлении сообщения",
            null,
            error.message
          )
        );
    }
  }

  static async deleteMessage(req, res) {
    try {
      const deleted = await chatMessageService.deleteMessage(req.params.id);
      if (!deleted) {
        return res
          .status(404)
          .json(formatResponse(404, "Сообщение не найдено"));
      }
      res.status(200).json(formatResponse(200, "Сообщение удалено"));
    } catch (error) {
      res
        .status(500)
        .json(
          formatResponse(
            500,
            "Ошибка при удалении сообщения",
            null,
            error.message
          )
        );
    }
  }

  // Новый метод для обработки AI запросов
  static async handleAIChat(req, res) {
    try {
      const { message } = req.body;
      const userId = res.locals.user?.id; // Может быть undefined для неавторизованных

      if (!message || !message.trim()) {
        return res
          .status(400)
          .json(formatResponse(400, "Сообщение не может быть пустым"));
      }

      // Сохраняем сообщение пользователя
      const userMessage = await chatMessageService.createMessage({
        user_id: userId || null,
        content: message.trim(),
        sender: "user",
      });

      let aiResponse = "";

      // Сначала проверяем, не запрос ли это о преподавателях
      const searchQuery = message.trim().toLowerCase();
      const teacherKeywords = ["преподаватель", "учитель", "профессор", "лектор", "дисциплина", "предмет"];
      const isTeacherSearch = teacherKeywords.some(keyword => searchQuery.includes(keyword));

      if (isTeacherSearch) {
        // Поиск преподавателей
        try {
          const searchResponse = await teacherService.searchTeachers(message.trim());
          if (searchResponse && searchResponse.length > 0) {
            aiResponse = `Найдено преподавателей: ${searchResponse.length}\n\n`;
            searchResponse.forEach((teacher, index) => {
              const fullName = `${teacher.last_name} ${teacher.first_name} ${teacher.middle_name || ""}`.trim();
              aiResponse += `${index + 1}. ${fullName}`;
              if (teacher.faculty) aiResponse += ` (${teacher.faculty})`;
              if (teacher.department) aiResponse += ` - ${teacher.department}`;
              aiResponse += `\n   ID: ${teacher.id}\n\n`;
            });
            aiResponse += "Нажмите на преподавателя, чтобы перейти на его страницу.";
          } else {
            // Если не найдено, используем AI
            aiResponse = await OpenRouterService.ask(message.trim());
          }
        } catch (error) {
          console.error("Ошибка поиска преподавателей:", error);
          // При ошибке поиска используем AI
          aiResponse = await OpenRouterService.ask(message.trim());
        }
      } else {
        // Обычный запрос - используем AI
        aiResponse = await OpenRouterService.ask(message.trim());
      }

      // Сохраняем ответ AI
      const assistantMessage = await chatMessageService.createMessage({
        user_id: userId || null,
        content: aiResponse,
        sender: "assistant",
      });

      res.status(200).json(
        formatResponse(200, "Ответ получен", {
          userMessage,
          assistantMessage,
        })
      );
    } catch (error) {
      console.error("Ошибка AI чата:", error);
      res
        .status(500)
        .json(
          formatResponse(
            500,
            "Ошибка при обработке запроса",
            null,
            error.message
          )
        );
    }
  }
}

module.exports = ChatMessageController;
