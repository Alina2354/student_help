import axiosInstance from "../../../shared/lib/axiosInstace";

export default class TeacherRatingApi {
  static async getAllRatings() {
    const response = await axiosInstance.get("/teacher-ratings");
    return response.data;
  }

  static async getRatingByTeacherId(teacherId) {
    const response = await axiosInstance.get(`/teacher-ratings/teacher/${teacherId}`);
    return response.data;
  }

  static async getRatingById(id) {
    const response = await axiosInstance.get(`/teacher-ratings/${id}`);
    return response.data;
  }

  static async incrementRating(teacherId, ratingType) {
    const response = await axiosInstance.post("/teacher-ratings/increment", {
      teacherId,
      ratingType
    });
    return response.data;
  }

  static async createRating(ratingData) {
    const response = await axiosInstance.post("/teacher-ratings", ratingData);
    return response.data;
  }

  static async updateRating(id, ratingData) {
    const response = await axiosInstance.put(`/teacher-ratings/${id}`, ratingData);
    return response.data;
  }

  static async deleteRating(id) {
    const response = await axiosInstance.delete(`/teacher-ratings/${id}`);
    return response.data;
  }

  static async resetUserVote(teacherId) {
    const response = await axiosInstance.post("/teacher-ratings/reset-vote", {
      teacherId
    });
    return response.data;
  }
}
