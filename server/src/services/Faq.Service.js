


const { Faq, Teacher, User } = require("../db/models");

class FaqService {
  static async getAllFaqs() {
    return Faq.findAll({
      include: [
        { 
          association: "teacher",
          attributes: ["id", "first_name", "last_name", "middle_name", "faculty", "department"]
        },
        { 
          association: "user",
          attributes: ["id", "name", "email"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });
  }

  static async getFaqsByTeacherId(teacherId) {
    return Faq.findAll({
      where: { teacher_id: teacherId },
      include: [
        { 
          association: "teacher",
          attributes: ["id", "first_name", "last_name", "middle_name"]
        },
        { 
          association: "user",
          attributes: ["id", "name", "email"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });
  }

  static async getFaqsByUserId(userId) {
    return Faq.findAll({
      where: { user_id: userId },
      include: [
        { 
          association: "teacher",
          attributes: ["id", "first_name", "last_name", "middle_name", "faculty", "department"]
        },
        { 
          association: "user",
          attributes: ["id", "name", "email"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });
  }

  static async getFaqById(id) {
    return Faq.findByPk(id, {
      include: [
        { 
          association: "teacher",
          attributes: ["id", "first_name", "last_name", "middle_name", "faculty", "department"]
        },
        { 
          association: "user",
          attributes: ["id", "name", "email"]
        }
      ]
    });
  }

  static async createFaq(data) {
    return Faq.create(data);
  }

  static async updateFaq(id, data) {
    const faq = await Faq.findByPk(id);
    if (!faq) return null;
    return await faq.update(data);
  }

  static async deleteFaq(id) {
    const faq = await Faq.findByPk(id);
    if (!faq) return null;
    return await faq.destroy();
  }
}

module.exports = FaqService;