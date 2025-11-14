const teacherService = require("../services/Teacher.Service");
const formatResponse = require("../utils/formatResponse");

class TeacherController {
  static async getAllTeachers(req, res) {
    try {
      const teachers = await teacherService.getAllTeachers();
      res.status(200).json(formatResponse(200, "Список преподавателей", teachers));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async getTeacherById(req, res) {
    try {
      const teacher = await teacherService.getTeacherById(req.params.id);
      if (!teacher) {
        return res.status(404).json(formatResponse(404, "Преподаватель не найден"));
      }
      res.status(200).json(formatResponse(200, "Преподаватель найден", teacher));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async searchTeachers(req, res) {
    try {
      const { query } = req.query;
      if (!query || query.trim().length === 0) {
        return res.status(400).json(formatResponse(400, "Запрос не может быть пустым"));
      }
      const teachers = await teacherService.searchTeachers(query);
      res.status(200).json(formatResponse(200, "Результаты поиска", teachers));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async createTeacher(req, res) {
    try {
      const { first_name, last_name, middle_name, faculty, department } = req.body;
      
      if (!first_name || !last_name) {
        return res.status(400).json(formatResponse(400, "Имя и фамилия обязательны"));
      }

      const teacher = await teacherService.createTeacher({
        first_name,
        last_name,
        middle_name,
        faculty,
        department
      });
      res.status(201).json(formatResponse(201, "Преподаватель создан", teacher));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка при создании преподавателя", null, error.message));
    }
  }

  static async updateTeacher(req, res) {
    try {
      const updated = await teacherService.updateTeacher(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json(formatResponse(404, "Преподаватель не найден"));
      }
      res.status(200).json(formatResponse(200, "Преподаватель обновлён", updated));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка при обновлении преподавателя", null, error.message));
    }
  }

  static async deleteTeacher(req, res) {
    try {
      const deleted = await teacherService.deleteTeacher(req.params.id);
      if (!deleted) {
        return res.status(404).json(formatResponse(404, "Преподаватель не найден"));
      }
      res.status(200).json(formatResponse(200, "Преподаватель удалён"));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка при удалении преподавателя", null, error.message));
    }
  }
}

module.exports = TeacherController;



