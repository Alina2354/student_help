const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: path.resolve(__dirname, "..", "..", ".env") });
const formatResponse = require("../utils/formatResponse");

function verifyRefreshToken(req, res, next) {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res
        .status(403)
        .json(
          formatResponse(
            403,
            "Доступ запрещён",
            null,
            "Refresh токен отсутствует"
          )
        );
    }

    const { user } = jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN);
    res.locals.user = user;
    next();
  } catch ({ message }) {
    console.log("=============verifyRefreshToken=============", message);
    res
      .status(403)
      .json(formatResponse(403, "Доступ запрещён", null, message));
  }
}

module.exports = verifyRefreshToken;

