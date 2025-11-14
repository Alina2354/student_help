


const faqService = require("../services/Faq.Service");
const formatResponse = require("../utils/formatResponse");

class FaqController {
  static async getAllFaqs(req, res) {
    try {
      const faqs = await faqService.getAllFaqs();
      res.status(200).json(formatResponse(200, "Список FAQ", faqs));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async getFaqsByTeacherId(req, res) {
    try {
      const faqs = await faqService.getFaqsByTeacherId(req.params.teacherId);
      res.status(200).json(formatResponse(200, "FAQ преподавателя", faqs));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async getFaqsByUserId(req, res) {
    try {
      const userId = req.params.userId || res.locals.user?.id;
      if (!userId) {
        return res.status(400).json(formatResponse(400, "ID пользователя не указан"));
      }
      const faqs = await faqService.getFaqsByUserId(userId);
      res.status(200).json(formatResponse(200, "FAQ пользователя", faqs));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async getMyFaqs(req, res) {
    try {
      const userId = res.locals.user?.id;
      if (!userId) {
        return res.status(401).json(formatResponse(401, "Пользователь не авторизован"));
      }
      const faqs = await faqService.getFaqsByUserId(userId);
      res.status(200).json(formatResponse(200, "Мои FAQ", faqs));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async getFaqById(req, res) {
    try {
      const faq = await faqService.getFaqById(req.params.id);
      if (!faq) {
        return res.status(404).json(formatResponse(404, "FAQ не найден"));
      }
      res.status(200).json(formatResponse(200, "FAQ найден", faq));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async createFaq(req, res) {
    try {
      const { teacher_id, text } = req.body;
      const userId = res.locals.user?.id;

      if (!userId) {
        return res.status(401).json(formatResponse(401, "Пользователь не авторизован"));
      }

      if (!teacher_id || !text) {
        return res.status(400).json(formatResponse(400, "ID преподавателя и текст обязательны"));
      }

      const faq = await faqService.createFaq({
        teacher_id,
        user_id: userId,
        text
      });
      res.status(201).json(formatResponse(201, "FAQ создан", faq));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка при создании FAQ", null, error.message));
    }
  }

  static async updateFaq(req, res) {
    try {
      const userId = res.locals.user?.id;
      const faq = await faqService.getFaqById(req.params.id);

      if (!faq) {
        return res.status(404).json(formatResponse(404, "FAQ не найден"));
      }

      // Пользователь может обновлять только свои FAQ, админ - любые
      if (faq.user_id !== userId && !res.locals.user?.is_admin) {
        return res.status(403).json(formatResponse(403, "Нет прав на обновление этого FAQ"));
      }

      const updated = await faqService.updateFaq(req.params.id, req.body);
      res.status(200).json(formatResponse(200, "FAQ обновлён", updated));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка при обновлении FAQ", null, error.message));
    }
  }

  static async deleteFaq(req, res) {
    try {
      const userId = res.locals.user?.id;
      const faq = await faqService.getFaqById(req.params.id);

      if (!faq) {
        return res.status(404).json(formatResponse(404, "FAQ не найден"));
      }

      // Пользователь может удалять только свои FAQ, админ - любые
      if (faq.user_id !== userId && !res.locals.user?.is_admin) {
        return res.status(403).json(formatResponse(403, "Нет прав на удаление этого FAQ"));
      }

      const deleted = await faqService.deleteFaq(req.params.id);
      res.status(200).json(formatResponse(200, "FAQ удалён"));
    } catch (error) {
      res.status(500).json(formatResponse(500, "Ошибка при удалении FAQ", null, error.message));
    }
  }
}

module.exports = FaqController;