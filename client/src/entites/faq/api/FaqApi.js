import axiosInstance from "../../../shared/lib/axiosInstace";

export default class FaqApi {
  static async getAllFaqs() {
    const response = await axiosInstance.get("/faqs");
    return response.data;
  }

  static async getFaqsByTeacherId(teacherId) {
    const response = await axiosInstance.get(`/faqs/teacher/${teacherId}`);
    return response.data;
  }

  static async getMyFaqs() {
    const response = await axiosInstance.get("/faqs/my");
    return response.data;
  }

  static async getFaqById(id) {
    const response = await axiosInstance.get(`/faqs/${id}`);
    return response.data;
  }

  static async createFaq(formData) {
    // Для FormData НЕ устанавливаем Content-Type - браузер установит его автоматически с boundary
    // Удаляем дефолтный Content-Type из конфига для этого запроса
    const response = await axiosInstance.post("/faqs", formData, {
      headers: {
        "Content-Type": undefined, // Позволяем браузеру установить правильный Content-Type с boundary
      },
    });
    return response.data;
  }

  static async updateFaq(id, faqData) {
    const response = await axiosInstance.put(`/faqs/${id}`, faqData);
    return response.data;
  }

  static async addAnswerToFaq(id, answer) {
    const response = await axiosInstance.put(`/faqs/${id}`, { answer });
    return response.data;
  }

  static async deleteFaq(id) {
    const response = await axiosInstance.delete(`/faqs/${id}`);
    return response.data;
  }

  static getFileDownloadUrl(id) {
    return `${axiosInstance.defaults.baseURL}/faqs/${id}/download`;
  }
}
