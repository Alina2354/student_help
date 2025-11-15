const express = require("express");
const router = express.Router();
const chatMessageController = require("../controllers/ChatMessage.controller");
const verifyAccessToken = require("../middlewares/verifyAccessToken");

// AI чат - доступен всем (но сохраняется только для авторизованных)
router.post("/ai", chatMessageController.handleAIChat);

// Создание сообщения доступно всем (но сохраняется только для авторизованных)
router.post("/", chatMessageController.createMessage);

// Получение своих сообщений (требует авторизации)
router.get("/my", verifyAccessToken, chatMessageController.getMyMessages);

// Получение сообщений пользователя (требует авторизации)
router.get(
  "/user/:userId",
  verifyAccessToken,
  chatMessageController.getMessagesByUserId
);

// Админские маршруты (можно добавить verifyAdmin если нужно)
router.get("/", verifyAccessToken, chatMessageController.getAllMessages);
router.get("/:id", verifyAccessToken, chatMessageController.getMessageById);
router.put("/:id", verifyAccessToken, chatMessageController.updateMessage);
router.delete("/:id", verifyAccessToken, chatMessageController.deleteMessage);

module.exports = router;
