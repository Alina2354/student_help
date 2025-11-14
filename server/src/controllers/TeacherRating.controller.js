


const teacherRatingService = require("../services/TeacherRating.Service");
const formatResponse = require("../utils/formatResponse");

class TeacherRatingController {
  static async getAllRatings(req, res) {
    try {
      const ratings = await teacherRatingService.getAllRatings();
      res.status(200).json(formatResponse(200, "Список рейтингов", ratings));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async getRatingByTeacherId(req, res) {
    try {
      const rating = await teacherRatingService.getRatingByTeacherId(req.params.teacherId);
      res.status(200).json(formatResponse(200, "Рейтинг найден", rating));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async getRatingById(req, res) {
    try {
      const rating = await teacherRatingService.getRatingById(req.params.id);
      if (!rating) {
        return res.status(404).json(formatResponse(404, "Рейтинг не найден"));
      }
      res.status(200).json(formatResponse(200, "Рейтинг найден", rating));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async createRating(req, res) {
    try {
      const { teacher_id, rating5, rating4, rating3 } = req.body;
      
      if (!teacher_id) {
        return res.status(400).json(formatResponse(400, "ID преподавателя обязателен"));
      }

      const rating = await teacherRatingService.createRating({
        teacher_id,
        rating5: rating5 || 0,
        rating4: rating4 || 0,
        rating3: rating3 || 0
      });
      res.status(201).json(formatResponse(201, "Рейтинг создан", rating));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка при создании рейтинга", null, error.message));
    }
  }

  static async updateRating(req, res) {
    try {
      const updated = await teacherRatingService.updateRating(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json(formatResponse(404, "Рейтинг не найден"));
      }
      res.status(200).json(formatResponse(200, "Рейтинг обновлён", updated));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка при обновлении рейтинга", null, error.message));
    }
  }

  static async incrementRating(req, res) {
    try {
      const { teacherId, ratingType } = req.body;
      
      if (!teacherId || !ratingType) {
        return res.status(400).json(formatResponse(400, "ID преподавателя и тип рейтинга обязательны"));
      }

      const rating = await teacherRatingService.incrementRating(teacherId, ratingType);
      res.status(200).json(formatResponse(200, "Рейтинг увеличен", rating));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка при увеличении рейтинга", null, error.message));
    }
  }

  static async deleteRating(req, res) {
    try {
      const deleted = await teacherRatingService.deleteRating(req.params.id);
      if (!deleted) {
        return res.status(404).json(formatResponse(404, "Рейтинг не найден"));
      }
      res.status(200).json(formatResponse(200, "Рейтинг удалён"));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка при удалении рейтинга", null, error.message));
    }
  }
}

module.exports = TeacherRatingController;