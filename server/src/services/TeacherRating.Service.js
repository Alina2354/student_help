const { TeacherRating } = require("../db/models");
const RatingVoteService = require("./RatingVote.Service");

class TeacherRatingService {
  static async getAllRatings() {
    return TeacherRating.findAll({
      include: [
        {
          association: "teacher",
          attributes: ["id", "first_name", "last_name", "middle_name"],
        },
      ],
    });
  }

  static async getRatingByTeacherId(teacherId) {
    let rating = await TeacherRating.findOne({
      where: { teacher_id: teacherId },
      include: [
        {
          association: "teacher",
          attributes: ["id", "first_name", "last_name", "middle_name"],
        },
      ],
    });

    if (!rating) {
      rating = await TeacherRating.create({
        teacher_id: teacherId,
        rating5: 0,
        rating4: 0,
        rating3: 0,
      });
      rating = await TeacherRating.findByPk(rating.id, {
        include: [
          {
            association: "teacher",
            attributes: ["id", "first_name", "last_name", "middle_name"],
          },
        ],
      });
    }

    return rating;
  }

  static async getRatingById(id) {
    return TeacherRating.findByPk(id, {
      include: [
        {
          association: "teacher",
          attributes: ["id", "first_name", "last_name", "middle_name"],
        },
      ],
    });
  }

  static async createRating(data) {
    const existing = await TeacherRating.findOne({
      where: { teacher_id: data.teacher_id },
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

  static async incrementRating(teacherId, ratingType, userId, isAdmin) {
    if (!["rating5", "rating4", "rating3"].includes(ratingType)) {
      throw new Error(
        "Неверный тип рейтинга. Допустимые значения: rating5, rating4, rating3"
      );
    }

    // Проверяем, голосовал ли уже пользователь (если не админ)
    if (!isAdmin && userId) {
      const hasVoted = await RatingVoteService.hasUserVoted(teacherId, userId);
      if (hasVoted) {
        throw new Error("Вы уже проголосовали за этого преподавателя");
      }
    }

    let rating = await TeacherRating.findOne({
      where: { teacher_id: teacherId },
    });

    if (!rating) {
      rating = await TeacherRating.create({
        teacher_id: teacherId,
        rating5: 0,
        rating4: 0,
        rating3: 0,
      });
    }

    // Если пользователь уже голосовал и это админ, удаляем старый голос
    if (isAdmin && userId) {
      await RatingVoteService.deleteVote(teacherId, userId);
    }

    // Увеличиваем рейтинг
    rating[ratingType] = (rating[ratingType] || 0) + 1;
    await rating.save();

    // Сохраняем голос (если не админ или админ голосует заново)
    if (userId) {
      await RatingVoteService.createVote(teacherId, userId, ratingType);
    }

    return rating;
  }

  static async deleteRating(id) {
    const rating = await TeacherRating.findByPk(id);
    if (!rating) return null;
    return await rating.destroy();
  }

  static async resetUserVote(teacherId, userId) {
    return RatingVoteService.deleteVote(teacherId, userId);
  }
}

module.exports = TeacherRatingService;
