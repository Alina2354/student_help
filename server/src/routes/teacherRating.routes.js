const express = require("express");
const router = express.Router();
const teacherRatingController = require("../controllers/TeacherRating.controller");
const verifyAccessToken = require("../middlewares/verifyAccessToken");
const verifyAdmin = require("../middlewares/verifyAdmin");

// Публичные маршруты (требуют авторизации)
router.get("/", verifyAccessToken, teacherRatingController.getAllRatings);
router.get("/teacher/:teacherId", verifyAccessToken, teacherRatingController.getRatingByTeacherId);
router.get("/:id", verifyAccessToken, teacherRatingController.getRatingById);

// Любой авторизованный пользователь может увеличить рейтинг
router.post("/increment", verifyAccessToken, teacherRatingController.incrementRating);

// Админские маршруты
router.post("/", verifyAccessToken, verifyAdmin, teacherRatingController.createRating);
router.put("/:id", verifyAccessToken, verifyAdmin, teacherRatingController.updateRating);
router.delete("/:id", verifyAccessToken, verifyAdmin, teacherRatingController.deleteRating);

module.exports = router;