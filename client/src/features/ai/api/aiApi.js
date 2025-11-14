import axiosInstance from "../../../shared/lib/axiosInstace";

export class AiApi {
  static async generateText(prompt) {
    const response = await axiosInstance.post("/ai/generate", {
      prompt,
    });

    return response;
  }
}
