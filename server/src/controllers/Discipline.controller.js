


const disciplineService = require("../services/Discipline.Service");
const formatResponse = require("../utils/formatResponse");

class DisciplineController {
  static async getAllDisciplines(req, res) {
    try {
      const disciplines = await disciplineService.getAllDisciplines();
      res.status(200).json(formatResponse(200, "Список дисциплин", disciplines));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async getDisciplinesByTeacherId(req, res) {
    try {
      const disciplines = await disciplineService.getDisciplinesByTeacherId(req.params.teacherId);
      res.status(200).json(formatResponse(200, "Дисциплины преподавателя", disciplines));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async getDisciplinesBySemester(req, res) {
    try {
      const { semester } = req.query;
      if (!semester) {
        return res.status(400).json(formatResponse(400, "Семестр не указан"));
      }
      const disciplines = await disciplineService.getDisciplinesBySemester(parseInt(semester));
      res.status(200).json(formatResponse(200, "Дисциплины по семестру", disciplines));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async getDisciplinesByTeacherAndSemester(req, res) {
    try {
      const { teacherId } = req.params;
      const { semester } = req.query;
      if (!semester) {
        return res.status(400).json(formatResponse(400, "Семестр не указан"));
      }
      const disciplines = await disciplineService.getDisciplinesByTeacherAndSemester(
        teacherId,
        parseInt(semester)
      );
      res.status(200).json(formatResponse(200, "Дисциплины преподавателя по семестру", disciplines));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async getDisciplineById(req, res) {
    try {
      const discipline = await disciplineService.getDisciplineById(req.params.id);
      if (!discipline) {
        return res.status(404).json(formatResponse(404, "Дисциплина не найдена"));
      }
      res.status(200).json(formatResponse(200, "Дисциплина найдена", discipline));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async createDiscipline(req, res) {
    try {
      const { teacher_id, title, semester } = req.body;
      
      if (!teacher_id || !title || !semester) {
        return res.status(400).json(formatResponse(400, "Все поля обязательны"));
      }

      const discipline = await disciplineService.createDiscipline({
        teacher_id,
        title,
        semester: parseInt(semester)
      });
      res.status(201).json(formatResponse(201, "Дисциплина создана", discipline));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка при создании дисциплины", null, error.message));
    }
  }

  static async updateDiscipline(req, res) {
    try {
      const updated = await disciplineService.updateDiscipline(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json(formatResponse(404, "Дисциплина не найдена"));
      }
      res.status(200).json(formatResponse(200, "Дисциплина обновлена", updated));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка при обновлении дисциплины", null, error.message));
    }
  }

  static async deleteDiscipline(req, res) {
    try {
      const deleted = await disciplineService.deleteDiscipline(req.params.id);
      if (!deleted) {
        return res.status(404).json(formatResponse(404, "Дисциплина не найдена"));
      }
      res.status(200).json(formatResponse(200, "Дисциплина удалена"));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка при удалении дисциплины", null, error.message));
    }
  }
}

module.exports = DisciplineController;