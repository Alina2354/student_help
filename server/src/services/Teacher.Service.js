


const { Teacher, Discipline, GradeRequirements } = require("../db/models");
const { Op } = require("sequelize");

class TeacherService {
  static async getAllTeachers() {
    return Teacher.findAll({
      include: [
        { 
          association: "disciplines",
          attributes: ["id", "title", "semester"]
        },
        { 
          association: "ratings",
          attributes: ["id", "rating5", "rating4", "rating3"]
        }
      ],
      order: [["last_name", "ASC"]]
    });
  }

  static async getTeacherById(id) {
    return Teacher.findByPk(id, {
      include: [
        { 
          association: "disciplines",
          attributes: ["id", "title", "semester"],
          order: [["semester", "ASC"]]
        },
        { 
          association: "ratings",
          attributes: ["id", "rating5", "rating4", "rating3"]
        },
        { 
          association: "faqs",
          include: [
            {
              association: "user",
              attributes: ["id", "name", "email"]
            }
          ],
          order: [["createdAt", "DESC"]]
        },
        {
          association: "gradeRequirements",
          include: [
            {
              association: "discipline",
              attributes: ["id", "title", "semester"]
            }
          ]
        }
      ]
    });
  }

  static async searchTeachers(query) {
    // Поиск по имени преподавателя или дисциплине
    const teachers = await Teacher.findAll({
      where: {
        [Op.or]: [
          { first_name: { [Op.iLike]: `%${query}%` } },
          { last_name: { [Op.iLike]: `%${query}%` } },
          { middle_name: { [Op.iLike]: `%${query}%` } }
        ]
      },
      include: [
        { 
          association: "disciplines",
          where: {
            title: { [Op.iLike]: `%${query}%` }
          },
          required: false
        }
      ],
      distinct: true
    });

    // Если не найдено по имени, ищем по дисциплине
    if (teachers.length === 0) {
      const disciplines = await Discipline.findAll({
        where: {
          title: { [Op.iLike]: `%${query}%` }
        },
        include: [
          {
            association: "teacher",
            include: [
              { 
                association: "disciplines",
                attributes: ["id", "title", "semester"]
              },
              { 
                association: "ratings",
                attributes: ["id", "rating5", "rating4", "rating3"]
              }
            ]
          }
        ]
      });

      return disciplines.map(d => d.teacher).filter(Boolean);
    }

    return teachers;
  }

  static async createTeacher(data) {
    return Teacher.create(data);
  }

  static async updateTeacher(id, data) {
    const teacher = await Teacher.findByPk(id);
    if (!teacher) return null;
    return await teacher.update(data);
  }

  static async deleteTeacher(id) {
    const teacher = await Teacher.findByPk(id);
    if (!teacher) return null;
    return await teacher.destroy();
  }
}

module.exports = TeacherService;