


const { TeacherRating, Teacher } = require("../db/models");

class TeacherRatingService {
  static async getAllRatings() {
    return TeacherRating.findAll({
      include: [{ 
        association: "teacher",
        attributes: ["id", "first_name", "last_name", "middle_name"]
      }]
    });
  }

  static async getRatingByTeacherId(teacherId) {
    let rating = await TeacherRating.findOne({
      where: { teacher_id: teacherId },
      include: [{ 
        association: "teacher",
        attributes: ["id", "first_name", "last_name", "middle_name"]
      }]
    });

    // Если рейтинга нет, создаем с нулевыми значениями
    if (!rating) {
      rating = await TeacherRating.create({
        teacher_id: teacherId,
        rating5: 0,
        rating4: 0,
        rating3: 0
      });
      rating = await TeacherRating.findByPk(rating.id, {
        include: [{ 
          association: "teacher",
          attributes: ["id", "first_name", "last_name", "middle_name"]
        }]
      });
    }

    return rating;
  }

  static async getRatingById(id) {
    return TeacherRating.findByPk(id, {
      include: [{ 
        association: "teacher",
        attributes: ["id", "first_name", "last_name", "middle_name"]
      }]
    });
  }

  static async createRating(data) {
    // Проверяем, существует ли уже рейтинг для этого преподавателя
    const existing = await TeacherRating.findOne({
      where: { teacher_id: data.teacher_id }
    });

    if (existing) {
      throw new Error("Рейтинг для этого преподавателя уже существует");
    }

    return TeacherRating.create(data);
  }

  static async updateRating(id, data) {
    const rating = await TeacherRating.findByPk(id);
    if (!rating) return null;
    return await rating.update(data);
  }

  static async incrementRating(teacherId, ratingType) {
    if (!["rating5", "rating4", "rating3"].includes(ratingType)) {
      throw new Error("Неверный тип рейтинга. Допустимые значения: rating5, rating4, rating3");
    }

    let rating = await TeacherRating.findOne({
      where: { teacher_id: teacherId }
    });

    if (!rating) {
      // Создаем новый рейтинг если его нет
      rating = await TeacherRating.create({
        teacher_id: teacherId,
        rating5: 0,
        rating4: 0,
        rating3: 0
      });
    }

    // Увеличиваем соответствующий рейтинг
    rating[ratingType] = (rating[ratingType] || 0) + 1;
    return await rating.save();
  }

  static async deleteRating(id) {
    const rating = await TeacherRating.findByPk(id);
    if (!rating) return null;
    return await rating.destroy();
  }
}

module.exports = TeacherRatingService;