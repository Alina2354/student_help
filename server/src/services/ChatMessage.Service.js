const { ChatMessage } = require("../db/models");

class ChatMessageService {
  static async getAllMessages() {
    return ChatMessage.findAll({
      include: [
        {
          association: "user",
          attributes: ["id", "name", "email"],
          required: false,
        },
      ],
      order: [["createdAt", "ASC"]],
    });
  }

  static async getMessagesByUserId(userId) {
    return ChatMessage.findAll({
      where: { user_id: userId },
      include: [
        {
          association: "user",
          attributes: ["id", "name", "email"],
          required: false,
        },
      ],
      order: [["createdAt", "ASC"]],
    });
  }

  static async getMessageById(id) {
    return ChatMessage.findByPk(id, {
      include: [
        {
          association: "user",
          attributes: ["id", "name", "email"],
          required: false,
        },
      ],
    });
  }

  static async createMessage(data) {
    // Теперь сохраняем все сообщения, даже если user_id null
    return ChatMessage.create(data);
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
      where: { user_id: userId },
    });
  }
}

module.exports = ChatMessageService;
