import axiosInstance from "../../../shared/lib/axiosInstace";

export default class TeacherApi {
  static async getAllTeachers() {
    const response = await axiosInstance.get("/teachers");
    return response.data;
  }

  static async getTeacherById(id) {
    const response = await axiosInstance.get(`/teachers/${id}`);
    return response.data;
  }

  static async searchTeachers(query) {
    const response = await axiosInstance.get(`/teachers/search?query=${encodeURIComponent(query)}`);
    return response.data;
  }

  static async createTeacher(teacherData) {
    const response = await axiosInstance.post("/teachers", teacherData);
    return response.data;
  }

  static async updateTeacher(id, teacherData) {
    const response = await axiosInstance.put(`/teachers/${id}`, teacherData);
    return response.data;
  }

  static async deleteTeacher(id) {
    const response = await axiosInstance.delete(`/teachers/${id}`);
    return response.data;
  }
}
