import axiosInstance from "../../../shared/lib/axiosInstace";

export default class ChatMessageApi {
  static async getAllMessages() {
    const response = await axiosInstance.get("/chat-messages");
    return response.data;
  }

  static async getMyMessages() {
    const response = await axiosInstance.get("/chat-messages/my");
    return response.data;
  }

  static async getMessagesByUserId(userId) {
    const response = await axiosInstance.get(`/chat-messages/user/${userId}`);
    return response.data;
  }

  static async createMessage(messageData) {
    const response = await axiosInstance.post("/chat-messages", messageData);
    return response.data;
  }

  static async updateMessage(id, messageData) {
    const response = await axiosInstance.put(`/chat-messages/${id}`, messageData);
    return response.data;
  }

  static async deleteMessage(id) {
    const response = await axiosInstance.delete(`/chat-messages/${id}`);
    return response.data;
  }
}
