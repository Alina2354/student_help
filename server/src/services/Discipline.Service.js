


const { Discipline, Teacher } = require("../db/models");

class DisciplineService {
  static async getAllDisciplines() {
    return Discipline.findAll({
      include: [{ 
        association: "teacher",
        attributes: ["id", "first_name", "last_name", "middle_name", "faculty", "department"]
      }],
      order: [["semester", "ASC"], ["title", "ASC"]]
    });
  }

  static async getDisciplinesByTeacherId(teacherId) {
    return Discipline.findAll({
      where: { teacher_id: teacherId },
      include: [{ 
        association: "teacher",
        attributes: ["id", "first_name", "last_name", "middle_name", "faculty", "department"]
      }],
      order: [["semester", "ASC"], ["title", "ASC"]]
    });
  }

  static async getDisciplinesBySemester(semester) {
    return Discipline.findAll({
      where: { semester },
      include: [{ 
        association: "teacher",
        attributes: ["id", "first_name", "last_name", "middle_name", "faculty", "department"]
      }],
      order: [["title", "ASC"]]
    });
  }

  static async getDisciplinesByTeacherAndSemester(teacherId, semester) {
    return Discipline.findAll({
      where: { 
        teacher_id: teacherId,
        semester 
      },
      include: [{ 
        association: "teacher",
        attributes: ["id", "first_name", "last_name", "middle_name", "faculty", "department"]
      }],
      order: [["title", "ASC"]]
    });
  }

  static async getDisciplineById(id) {
    return Discipline.findByPk(id, {
      include: [{ 
        association: "teacher",
        attributes: ["id", "first_name", "last_name", "middle_name", "faculty", "department"]
      }]
    });
  }

  static async createDiscipline(data) {
    return Discipline.create(data);
  }

  static async updateDiscipline(id, data) {
    const discipline = await Discipline.findByPk(id);
    if (!discipline) return null;
    return await discipline.update(data);
  }

  static async deleteDiscipline(id) {
    const discipline = await Discipline.findByPk(id);
    if (!discipline) return null;
    return await discipline.destroy();
  }
}

module.exports = DisciplineService;