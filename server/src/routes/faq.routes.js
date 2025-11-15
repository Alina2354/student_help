const express = require("express");
const router = express.Router();

const faqController = require("../controllers/Faq.controller");
const verifyAccessToken = require("../middlewares/verifyAccessToken");
const upload = require("../middlewares/uploadFile");

// Публичные маршруты
router.get("/", verifyAccessToken, faqController.getAllFaqs);
router.get(
  "/teacher/:teacherId",
  verifyAccessToken,
  faqController.getFaqsByTeacherId
);
router.get("/my", verifyAccessToken, faqController.getMyFaqs);
router.get("/user/:userId", verifyAccessToken, faqController.getFaqsByUserId);
router.get("/:id", verifyAccessToken, faqController.getFaqById);

// Скачивание файла - БЕЗ авторизации (доступно всем)
router.get("/:id/download", faqController.downloadFile);

// Создание FAQ с загрузкой файла
router.post(
  "/",
  verifyAccessToken,
  upload.single("file"),
  faqController.createFaq
);

// Обновление и удаление
router.put("/:id", verifyAccessToken, faqController.updateFaq);
router.delete("/:id", verifyAccessToken, faqController.deleteFaq);

module.exports = router;
