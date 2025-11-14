require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwtConfig");

const generateTokens = (payload) => ({
  accessToken: jwt.sign( //создает токен
    payload,
    process.env.SECRET_ACCESS_TOKEN, // переменная из .env
    jwtConfig.access //срок жизни
  ),
  refreshToken: jwt.sign(
    payload,
    process.env.SECRET_REFRESH_TOKEN,
    jwtConfig.refresh
  ),
});

module.exports = generateTokens;