import axiosInstance from "../../../shared/lib/axiosInstace";

export default class TaskApi {
  static async createTask(newTask) {
    const response = await axiosInstance.post(`/tasks/${newTask.id}`, newTask);
    return response;
  }

  static async deleteTask(id) {
    const response = await axiosInstance.delete(`/tasks/${id}`);
    return response;
  }

  static async editTask(id, taskData) {
    const response = await axiosInstance.put(`/tasks/${id}`, taskData);
    return response;
  }
}

// axios -  очень мощная библиотека, для того, чтобы делать запросы с клиента на сервер
// axiosInstance - это конкретная настройка axios в твоем проекте(шаблон использования axios, его логика для твоего проекта и ничего лишнего)
// fetch - фукнция позволяет делать запросы в среде исполнения (нода или браузера)
