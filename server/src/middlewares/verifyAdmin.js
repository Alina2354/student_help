const formatResponse = require("../utils/formatResponse");

function verifyAdmin(req, res, next) {
  try {
    const user = res.locals.user;
    
    if (!user) {
      return res
        .status(403)
        .json(formatResponse(403, "Доступ запрещён", null, "Пользователь не авторизован"));
    }

    if (!user.is_admin) {
      return res
        .status(403)
        .json(formatResponse(403, "Доступ запрещён", null, "Требуются права администратора"));
    }

    next();
  } catch (error) {
    res
      .status(500)
      .json(formatResponse(500, "Ошибка сервера", null, error.message));
  }
}

module.exports = verifyAdmin;
