


const { ChatMessage } = require("../db/models");

class ChatMessageService {
  static async getAllMessages() {
    return ChatMessage.findAll({
      include: [{ 
        association: "user",
        attributes: ["id", "name", "email"]
      }],
      order: [["createdAt", "ASC"]]
    });
  }

  static async getMessagesByUserId(userId) {
    return ChatMessage.findAll({
      where: { user_id: userId },
      include: [{ 
        association: "user",
        attributes: ["id", "name", "email"]
      }],
      order: [["createdAt", "ASC"]]
    });
  }

  static async getMessageById(id) {
    return ChatMessage.findByPk(id, {
      include: [{ 
        association: "user",
        attributes: ["id", "name", "email"]
      }]
    });
  }

  static async createMessage(data) {
    // Сохраняем сообщение только если user_id указан (пользователь залогинен)
    if (!data.user_id) {
      throw new Error("Сообщение может быть сохранено только для авторизованных пользователей");
    }
    return ChatMessage.create(data);
  }

  static async createMessageForGuest(content, sender) {
    // Для неавторизованных пользователей не сохраняем в БД
    // Возвращаем объект без сохранения
    return {
      content,
      sender,
      user_id: null,
      createdAt: new Date()
    };
  }

  static async updateMessage(id, data) {
    const message = await ChatMessage.findByPk(id);
    if (!message) return null;
    return await message.update(data);
  }

  static async deleteMessage(id) {
    const message = await ChatMessage.findByPk(id);
    if (!message) return null;
    return await message.destroy();
  }

  static async deleteMessagesByUserId(userId) {
    return ChatMessage.destroy({
      where: { user_id: userId }
    });
  }
}

module.exports = ChatMessageService;