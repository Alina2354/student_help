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

  static async createFaq(faqData) {
    const response = await axiosInstance.post("/faqs", faqData);
    return response.data;
  }

  static async updateFaq(id, faqData) {
    const response = await axiosInstance.put(`/faqs/${id}`, faqData);
    return response.data;
  }

  static async deleteFaq(id) {
    const response = await axiosInstance.delete(`/faqs/${id}`);
    return response.data;
  }
}
