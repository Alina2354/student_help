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

  static async createTeacher(teacherData, avatar = null) {
    const formData = new FormData();
    formData.append("first_name", teacherData.first_name);
    formData.append("last_name", teacherData.last_name);
    if (teacherData.middle_name) formData.append("middle_name", teacherData.middle_name);
    if (teacherData.faculty) formData.append("faculty", teacherData.faculty);
    if (teacherData.department) formData.append("department", teacherData.department);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    const response = await axiosInstance.post("/teachers", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  static async updateTeacher(id, teacherData, avatar = null) {
    const formData = new FormData();
    if (teacherData.first_name) formData.append("first_name", teacherData.first_name);
    if (teacherData.last_name) formData.append("last_name", teacherData.last_name);
    if (teacherData.middle_name) formData.append("middle_name", teacherData.middle_name);
    if (teacherData.faculty) formData.append("faculty", teacherData.faculty);
    if (teacherData.department) formData.append("department", teacherData.department);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    const response = await axiosInstance.put(`/teachers/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  static async deleteTeacher(id) {
    const response = await axiosInstance.delete(`/teachers/${id}`);
    return response.data;
  }
}
