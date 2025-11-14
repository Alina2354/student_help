const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/Teacher.controller");
const verifyAccessToken = require("../middlewares/verifyAccessToken");
const verifyAdmin = require("../middlewares/verifyAdmin");

// Публичные маршруты (требуют авторизации, но доступны всем)
router.get("/", verifyAccessToken, teacherController.getAllTeachers);
router.get("/search", verifyAccessToken, teacherController.searchTeachers);
router.get("/:id", verifyAccessToken, teacherController.getTeacherById);

// Админские маршруты
router.post("/", verifyAccessToken, verifyAdmin, teacherController.createTeacher);
router.put("/:id", verifyAccessToken, verifyAdmin, teacherController.updateTeacher);
router.delete("/:id", verifyAccessToken, verifyAdmin, teacherController.deleteTeacher);

module.exports = router;



