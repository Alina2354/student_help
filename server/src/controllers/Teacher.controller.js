const teacherService = require("../services/Teacher.Service");
const formatResponse = require("../utils/formatResponse");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Настройка multer для загрузки аватарок
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.resolve(__dirname, "..", "..", "public", "avatars");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
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
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Недопустимый тип файла. Разрешены: jpeg, jpg, png, gif"));
    }
  },
}).single("avatar");

class TeacherController {
  static async getAllTeachers(req, res) {
    try {
      const teachers = await teacherService.getAllTeachers();
      res
        .status(200)
        .json(formatResponse(200, "Список преподавателей", teachers));
    } catch (error) {
      res
        .status(500)
        .json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async getTeacherById(req, res) {
    try {
      const teacher = await teacherService.getTeacherById(req.params.id);
      if (!teacher) {
        return res
          .status(404)
          .json(formatResponse(404, "Преподаватель не найден"));
      }
      res
        .status(200)
        .json(formatResponse(200, "Преподаватель найден", teacher));
    } catch (error) {
      res
        .status(500)
        .json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async searchTeachers(req, res) {
    try {
      const { query } = req.query;
      if (!query || query.trim().length === 0) {
        return res
          .status(400)
          .json(formatResponse(400, "Запрос не может быть пустым"));
      }
      const teachers = await teacherService.searchTeachers(query);
      res.status(200).json(formatResponse(200, "Результаты поиска", teachers));
    } catch (error) {
      res
        .status(500)
        .json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }

  static async createTeacher(req, res) {
    upload(req, res, async (err) => {
      if (err) {
        return res
          .status(400)
          .json(
            formatResponse(400, "Ошибка загрузки файла", null, err.message)
          );
      }

      try {
        const { first_name, last_name, middle_name, faculty, department } =
          req.body;

        if (!first_name || !last_name) {
          return res
            .status(400)
            .json(formatResponse(400, "Имя и фамилия обязательны"));
        }

        const avatarPath = req.file
          ? `/public/avatars/${req.file.filename}`
          : null;

        const teacher = await teacherService.createTeacher({
          first_name,
          last_name,
          middle_name,
          faculty,
          department,
          avatar: avatarPath,
        });
        res
          .status(201)
          .json(formatResponse(201, "Преподаватель создан", teacher));
      } catch (error) {
        res
          .status(500)
          .json(
            formatResponse(
              500,
              "Ошибка при создании преподавателя",
              null,
              error.message
            )
          );
      }
    });
  }

  static async updateTeacher(req, res) {
    upload(req, res, async (err) => {
      if (err) {
        return res
          .status(400)
          .json(
            formatResponse(400, "Ошибка загрузки файла", null, err.message)
          );
      }

      try {
        const teacher = await teacherService.getTeacherById(req.params.id);
        if (!teacher) {
          return res
            .status(404)
            .json(formatResponse(404, "Преподаватель не найден"));
        }

        const updateData = { ...req.body };

        // Если загружен новый файл, удаляем старый и обновляем путь
        if (req.file) {
          if (teacher.avatar) {
            const oldFilePath = path.resolve(
              __dirname,
              "..",
              "..",
              "public",
              teacher.avatar.replace("/public/", "")
            );
            if (fs.existsSync(oldFilePath)) {
              fs.unlinkSync(oldFilePath);
            }
          }
          updateData.avatar = `/public/avatars/${req.file.filename}`;
        }

        const updated = await teacherService.updateTeacher(
          req.params.id,
          updateData
        );
        res
          .status(200)
          .json(formatResponse(200, "Преподаватель обновлён", updated));
      } catch (error) {
        res
          .status(500)
          .json(
            formatResponse(
              500,
              "Ошибка при обновлении преподавателя",
              null,
              error.message
            )
          );
      }
    });
  }

  static async deleteTeacher(req, res) {
    try {
      const teacher = await teacherService.getTeacherById(req.params.id);

      if (!teacher) {
        return res
          .status(404)
          .json(formatResponse(404, "Преподаватель не найден"));
      }

      // Удаляем аватарку, если она есть
      if (teacher.avatar) {
        const filePath = path.resolve(
          __dirname,
          "..",
          "..",
          "public",
          teacher.avatar.replace("/public/", "") 
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      const deleted = await teacherService.deleteTeacher(req.params.id);
      res.status(200).json(formatResponse(200, "Преподаватель удалён"));
    } catch (error) {
      res
        .status(500)
        .json(
          formatResponse(
            500,
            "Ошибка при удалении преподавателя",
            null,
            error.message
          )
        );
    }
  }
}

module.exports = TeacherController;
