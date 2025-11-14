const authRouter = require("express").Router();
const AuthController = require("../controllers/Auth.controller");
const verifyRefreshToken = require("../middlewares/verifyRefreshToken");

authRouter.get("/refreshTokens", verifyRefreshToken, AuthController.refreshTokens);
authRouter.post("/signup", AuthController.signup);
authRouter.post("/login", AuthController.login);
authRouter.get("/logout", AuthController.logout);

module.exports = authRouter;
