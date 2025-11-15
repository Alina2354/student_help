const gradeRequirementsService = require("../services/GradeRequirements.Service");
const formatResponse = require("../utils/formatResponse");

class GradeRequirementsController {
  static async getRequirementsByTeacherAndDiscipline(req, res) {
    try {
      const { teacherId, disciplineId } = req.params;
      const { semester } = req.query;

      if (!semester) {
        return res.status(400).json(formatResponse(400, "Семестр обязателен"));
      }

      const requirements =
        await gradeRequirementsService.getRequirementsByTeacherAndDiscipline(
          teacherId,
          disciplineId,
          parseInt(semester)
        );

      if (!requirements) {
        return res
          .status(404)
          .json(formatResponse(404, "Требования не найдены"));
      }

      res
        .status(200)
        .json(formatResponse(200, "Требования найдены", requirements));
    } catch (error) {
      res
        .status(500)
        .json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async getAllRequirementsByTeacher(req, res) {
    try {
      const { teacherId } = req.params;
      const requirements =
        await gradeRequirementsService.getAllRequirementsByTeacher(teacherId);
      res
        .status(200)
        .json(formatResponse(200, "Список требований", requirements));
    } catch (error) {
      res
        .status(500)
        .json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async createRequirements(req, res) {
    try {
      const {
        teacher_id,
        discipline_id,
        semester,
        requirements_5,
        requirements_4,
        requirements_3,
      } = req.body;

      if (!teacher_id || !discipline_id || !semester) {
        return res
          .status(400)
          .json(
            formatResponse(400, "Все обязательные поля должны быть заполнены")
          );
      }

      const requirements = await gradeRequirementsService.createRequirements({
        teacher_id,
        discipline_id,
        semester: parseInt(semester),
        requirements_5,
        requirements_4,
        requirements_3,
      });
      res
        .status(201)
        .json(formatResponse(201, "Требования созданы", requirements));
    } catch (error) {
      res
        .status(500)
        .json(
          formatResponse(
            500,
            "Ошибка при создании требований",
            null,
            error.message
          )
        );
    }
  }

  static async updateRequirements(req, res) {
    try {
      const updated = await gradeRequirementsService.updateRequirements(
        req.params.id,
        req.body
      );
      if (!updated) {
        return res
          .status(404)
          .json(formatResponse(404, "Требования не найдены"));
      }
      res
        .status(200)
        .json(formatResponse(200, "Требования обновлены", updated));
    } catch (error) {
      res
        .status(500)
        .json(
          formatResponse(
            500,
            "Ошибка при обновлении требований",
            null,
            error.message
          )
        );
    }
  }

  static async deleteRequirements(req, res) {
    try {
      const deleted = await gradeRequirementsService.deleteRequirements(
        req.params.id
      );
      if (!deleted) {
        return res
          .status(404)
          .json(formatResponse(404, "Требования не найдены"));
      }
      res.status(200).json(formatResponse(200, "Требования удалены"));
    } catch (error) {
      res
        .status(500)
        .json(
          formatResponse(
            500,
            "Ошибка при удалении требований",
            null,
            error.message
          )
        );
    }
  }
}

module.exports = GradeRequirementsController;
