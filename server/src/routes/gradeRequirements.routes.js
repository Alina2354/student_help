const express = require("express");
const router = express.Router();
const gradeRequirementsController = require("../controllers/GradeRequirements.controller");
const verifyAccessToken = require("../middlewares/verifyAccessToken");

const verifyAdmin = require("../middlewares/verifyAdmin");

// Публичные маршруты
router.get(
  "/teacher/:teacherId",
  verifyAccessToken,
  gradeRequirementsController.getAllRequirementsByTeacher
);

router.get(
  "/teacher/:teacherId/discipline/:disciplineId",
  verifyAccessToken,
  gradeRequirementsController.getRequirementsByTeacherAndDiscipline
);

// Админские маршруты
router.post(
  "/",
  verifyAccessToken,
  verifyAdmin,
  gradeRequirementsController.createRequirements
);

router.put(
  "/:id",
  verifyAccessToken,
  verifyAdmin,
  gradeRequirementsController.updateRequirements
);

router.delete(
  "/:id",
  verifyAccessToken,
  verifyAdmin,
  gradeRequirementsController.deleteRequirements
);

module.exports = router;
