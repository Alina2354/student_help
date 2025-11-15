const faqService = require("../services/Faq.Service");
const formatResponse = require("../utils/formatResponse");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Настройка multer для загрузки файлов
const uploadDir = path.resolve(__dirname, "..", "public", "faq-files");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          "Недопустимый тип файла. Разрешены: jpeg, jpg, png, gif, pdf, doc, docx"
        )
      );
    }
  },
}).single("file");

class FaqController {
  static async getAllFaqs(req, res) {
    try {
      const faqs = await faqService.getAllFaqs();
      res.status(200).json(formatResponse(200, "Список FAQ", faqs));
    } catch (error) {
      res
        .status(500)
        .json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async getFaqsByTeacherId(req, res) {
    try {
      const faqs = await faqService.getFaqsByTeacherId(req.params.teacherId);
      res.status(200).json(formatResponse(200, "FAQ преподавателя", faqs));
    } catch (error) {
      res
        .status(500)
        .json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async getFaqsByUserId(req, res) {
    try {
      const userId = req.params.userId || res.locals.user?.id;
      if (!userId) {
        return res
          .status(400)
          .json(formatResponse(400, "ID пользователя не указан"));
      }
      const faqs = await faqService.getFaqsByUserId(userId);
      res.status(200).json(formatResponse(200, "FAQ пользователя", faqs));
    } catch (error) {
      res
        .status(500)
        .json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async getMyFaqs(req, res) {
    try {
      const userId = res.locals.user?.id;
      if (!userId) {
        return res
          .status(401)
          .json(formatResponse(401, "Пользователь не авторизован"));
      }
      const faqs = await faqService.getFaqsByUserId(userId);
      res.status(200).json(formatResponse(200, "Мои FAQ", faqs));
    } catch (error) {
      res
        .status(500)
        .json(formatResponse(500, "Ошибка сервера", null, error.message));
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
      res
        .status(500)
        .json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async updateFaq(req, res) {
    try {
      const userId = res.locals.user?.id;
      const faq = await faqService.getFaqById(req.params.id);

      if (!faq) {
        return res.status(404).json(formatResponse(404, "FAQ не найден"));
      }

      // Только админ может обновлять answer
      if (req.body.answer && !res.locals.user?.is_admin) {
        return res
          .status(403)
          .json(formatResponse(403, "Только администратор может добавлять ответы"));
      }

      if (faq.user_id !== userId && !res.locals.user?.is_admin) {
        return res
          .status(403)
          .json(formatResponse(403, "Нет прав на обновление этого FAQ"));
      }

      const updated = await faqService.updateFaq(req.params.id, req.body);
      res.status(200).json(formatResponse(200, "FAQ обновлён", updated));
    } catch (error) {
      res
        .status(500)
        .json(
          formatResponse(500, "Ошибка при обновлении FAQ", null, error.message)
        );
    }
  }

  static async deleteFaq(req, res) {
    try {
      const userId = res.locals.user?.id;
      const faq = await faqService.getFaqById(req.params.id);

      if (!faq) {
        return res.status(404).json(formatResponse(404, "FAQ не найден"));
      }

      if (faq.user_id !== userId && !res.locals.user?.is_admin) {
        return res
          .status(403)
          .json(formatResponse(403, "Нет прав на удаление этого FAQ"));
      }

      // Удаляем файл, если он есть
      if (faq.file_path) {
        // Убираем /files/ из начала пути, чтобы получить относительный путь
        const relativePath = faq.file_path.replace(/^\/files\//, "");
        const filePath = path.resolve(
          __dirname,
          "..",
          "..",
          "public",
          relativePath
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      const deleted = await faqService.deleteFaq(req.params.id);
      res.status(200).json(formatResponse(200, "FAQ удалён"));
    } catch (error) {
      res
        .status(500)
        .json(
          formatResponse(500, "Ошибка при удалении FAQ", null, error.message)
        );
    }
  }

  static async createFaq(req, res) {
    try {
      // Multer уже обработал файл, теперь парсим req.body
      const { teacher_id, text, answer } = req.body;
      const userId = res.locals.user?.id;

      if (!userId) {
        return res
          .status(401)
          .json(formatResponse(401, "Пользователь не авторизован"));
      }

      if (!teacher_id || !text) {
        return res
          .status(400)
          .json(formatResponse(400, "ID преподавателя и текст обязательны"));
      }

      // Путь должен начинаться с /files/faq-files/ для доступа через статику
      const filePath = req.file
        ? `/files/faq-files/${req.file.filename}`
        : null;

      const faq = await faqService.createFaq({
        teacher_id: parseInt(teacher_id),
        user_id: userId,
        text: text.trim(),
        answer: answer ? answer.trim() : null,
        file_path: filePath,
      });
      res.status(201).json(formatResponse(201, "FAQ создан", faq));
    } catch (error) {
      console.error("Ошибка создания FAQ:", error);
      res
        .status(500)
        .json(
          formatResponse(500, "Ошибка при создании FAQ", null, error.message)
        );
    }
  }

  static async downloadFile(req, res) {
    try {
      const { id } = req.params;
      const faq = await faqService.getFaqById(id);

      if (!faq || !faq.file_path) {
        return res.status(404).json(formatResponse(404, "Файл не найден"));
      }

      // faq.file_path имеет формат: /files/faq-files/имя_файла.ext
      // Нужно получить: public/faq-files/имя_файла.ext
      const relativePath = faq.file_path;
      const absolutePath = path.resolve(
        __dirname,
        "..",
        "public",
        relativePath
      );

      console.log("Путь к файлу:", absolutePath);
      console.log("Файл существует:", fs.existsSync(absolutePath));

      if (!fs.existsSync(absolutePath)) {
        return res
          .status(404)
          .json(formatResponse(404, "Файл не найден на сервере"));
      }

      // Получаем оригинальное имя файла
      const fileName = faq.file_path.split("/").pop();

      // Устанавливаем заголовки для скачивания
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      res.download(absolutePath, fileName, (err) => {
        if (err) {
          console.error("Ошибка при скачивании:", err);
          if (!res.headersSent) {
            res
              .status(500)
              .json(
                formatResponse(
                  500,
                  "Ошибка при скачивании файла",
                  null,
                  err.message
                )
              );
          }
        }
      });
    } catch (error) {
      console.error("Ошибка downloadFile:", error);
      res
        .status(500)
        .json(
          formatResponse(
            500,
            "Ошибка при скачивании файла",
            null,
            error.message
          )
        );
    }
  }
}

module.exports = FaqController;
