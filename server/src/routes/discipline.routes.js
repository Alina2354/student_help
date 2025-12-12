const express = require("express");
const router = express.Router();
const disciplineController = require("../controllers/Discipline.controller");
const verifyAccessToken = require("../middlewares/verifyAccessToken");
const verifyAdmin = require("../middlewares/verifyAdmin");

// Публичные маршруты (требуют авторизации)
router.get("/", verifyAccessToken, disciplineController.getAllDisciplines);
router.get(
  "/teacher/:teacherId",
  verifyAccessToken,
  disciplineController.getDisciplinesByTeacherId
);
router.get(
  "/semester",
  verifyAccessToken,
  disciplineController.getDisciplinesBySemester
);
router.get(
  "/teacher/:teacherId/semester",
  verifyAccessToken,
  disciplineController.getDisciplinesByTeacherAndSemester
);
router.get("/:id", verifyAccessToken, disciplineController.getDisciplineById);

// Админские маршруты
router.post(
  "/",
  verifyAccessToken,
  disciplineController.createDiscipline
);
router.put(
  "/:id",
  verifyAccessToken,
  verifyAdmin,
  disciplineController.updateDiscipline
);
router.delete(
  "/:id",
  verifyAccessToken,
  verifyAdmin,
  disciplineController.deleteDiscipline
);

module.exports = router;
