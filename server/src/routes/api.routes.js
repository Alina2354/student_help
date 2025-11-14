const router = require("express").Router();
const formatResponse = require("../utils/formatResponse");
const userRoutes = require("./user.routes");
const authRoutes = require("./auth.routes");
const teacherRoutes = require("./teacher.routes");
const chatMessageRoutes = require("./chatMessage.routes");
const disciplineRoutes = require("./discipline.routes");
const teacherRatingRoutes = require("./teacherRating.routes");
const faqRoutes = require("./faq.routes");

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/teachers", teacherRoutes);
router.use("/chat-messages", chatMessageRoutes);
router.use("/disciplines", disciplineRoutes);
router.use("/teacher-ratings", teacherRatingRoutes);
router.use("/faqs", faqRoutes);

router.use((req, res) => {
  res
    .status(404)
    .json(formatResponse(404, "Маршрут не найден", null, "Маршрут не найден"));
});

module.exports = router;
