import axiosInstance from "../../../shared/lib/axiosInstace";

export default class UserApi {
  static async refreshTokens() {
    const response = await axiosInstance.get("/auth/refreshTokens");
    return response.data;
  }

  static async signup(userData) {
    const response = await axiosInstance.post("/auth/signup", userData);
    return response;
  }

  static async login(userData) {
    const response = await axiosInstance.post("/auth/login", userData);
    return response;
  }

  static async logout() {
    const response = await axiosInstance.get("/auth/logout");
    return response;
  }
}
