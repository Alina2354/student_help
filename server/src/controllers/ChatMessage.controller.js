const chatMessageService = require("../services/ChatMessage.Service");
const formatResponse = require("../utils/formatResponse");

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
}

module.exports = ChatMessageController;
