import axiosInstance from "../../../shared/lib/axiosInstace";

export default class GradeRequirementsApi {
  static async getAllRequirementsByTeacher(teacherId) {
    const response = await axiosInstance.get(`/grade-requirements/teacher/${teacherId}`);
    return response.data;
  }

  static async getRequirementsByTeacherAndDiscipline(teacherId, disciplineId, semester) {
    const response = await axiosInstance.get(
      `/grade-requirements/teacher/${teacherId}/discipline/${disciplineId}?semester=${semester}`
    );
    return response.data;
  }

  static async createRequirements(requirementsData) {
    const response = await axiosInstance.post("/grade-requirements", requirementsData);
    return response.data;
  }

  static async updateRequirements(id, requirementsData) {
    const response = await axiosInstance.put(`/grade-requirements/${id}`, requirementsData);
    return response.data;
  }

  static async deleteRequirements(id) {
    const response = await axiosInstance.delete(`/grade-requirements/${id}`);
    return response.data;
  }
}
