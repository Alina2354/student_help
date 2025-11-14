import axiosInstance from "../../../shared/lib/axiosInstace";

export default class DisciplineApi {
  static async getAllDisciplines() {
    const response = await axiosInstance.get("/disciplines");
    return response.data;
  }

  static async getDisciplinesByTeacherId(teacherId) {
    const response = await axiosInstance.get(`/disciplines/teacher/${teacherId}`);
    return response.data;
  }

  static async getDisciplinesBySemester(semester) {
    const response = await axiosInstance.get(`/disciplines/semester?semester=${semester}`);
    return response.data;
  }

  static async getDisciplinesByTeacherAndSemester(teacherId, semester) {
    const response = await axiosInstance.get(`/disciplines/teacher/${teacherId}/semester?semester=${semester}`);
    return response.data;
  }

  static async getDisciplineById(id) {
    const response = await axiosInstance.get(`/disciplines/${id}`);
    return response.data;
  }

  static async createDiscipline(disciplineData) {
    const response = await axiosInstance.post("/disciplines", disciplineData);
    return response.data;
  }

  static async updateDiscipline(id, disciplineData) {
    const response = await axiosInstance.put(`/disciplines/${id}`, disciplineData);
    return response.data;
  }

  static async deleteDiscipline(id) {
    const response = await axiosInstance.delete(`/disciplines/${id}`);
    return response.data;
  }
}
