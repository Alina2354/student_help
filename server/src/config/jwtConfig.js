const jwtConfig = {
  access: {
    expiresIn: "15m", // 15 минут
  },
  refresh: {
    expiresIn: "7d", // 7 дней
  },
};

module.exports = jwtConfig;
