const express = require("express");
const router = express.Router();
const userController = require("../controllers/User.controller");
const verifyAccessToken = require("../middlewares/verifyAccessToken");

router.get("/", verifyAccessToken, userController.getAllUsers);
router.get("/:id", verifyAccessToken, userController.getUserById);
router.post("/", verifyAccessToken, userController.createUser);
router.put("/:id", verifyAccessToken, userController.updateUser);
router.delete("/:id", verifyAccessToken, userController.deleteUser);

module.exports = router;
