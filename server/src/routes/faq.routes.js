const express = require("express");
const router = express.Router();
const faqController = require("../controllers/Faq.controller");
const verifyAccessToken = require("../middlewares/verifyAccessToken");

// Публичные маршруты (требуют авторизации)
router.get("/", verifyAccessToken, faqController.getAllFaqs);
router.get("/teacher/:teacherId", verifyAccessToken, faqController.getFaqsByTeacherId);
router.get("/my", verifyAccessToken, faqController.getMyFaqs);
router.get("/user/:userId", verifyAccessToken, faqController.getFaqsByUserId);
router.get("/:id", verifyAccessToken, faqController.getFaqById);

// Любой авторизованный пользователь может создать FAQ
router.post("/", verifyAccessToken, faqController.createFaq);

// Пользователь может обновлять/удалять только свои FAQ
router.put("/:id", verifyAccessToken, faqController.updateFaq);
router.delete("/:id", verifyAccessToken, faqController.deleteFaq);

module.exports = router;