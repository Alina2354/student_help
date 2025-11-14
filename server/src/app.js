const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
const express = require("express");
const { PORT } = process.env || 3000;

const serverConfig = require("./config/serverConfig");
const apiRoutes = require("./routes/api.routes");
const { sequelize } = require("./db/models");
const app = express();

serverConfig(app);

// Проверка подключения к базе данных
(async () => {
  try {
    await sequelize.authenticate();
    console.log("\u001b[32m✅ Подключение к базе данных установлено успешно\u001b[0m");
    
    // Синхронизация моделей с базой данных (опционально, лучше использовать миграции)
    // await sequelize.sync({ alter: false });
  } catch (error) {
    console.error("\u001b[31m❌ Ошибка подключения к базе данных:\u001b[0m", error.message);
  }
})();

app.get("/api/cookie", (req, res) => {
  res
    .cookie("test", "info", {
      maxAge: 1000 * 60 * 60 * 60,
      httpOnly: true,
    })
    .send("done");
});

app.delete("/api/cookie", (req, res) => {
  res.clearCookie("test").send("ok");
});

app.get("/api/my-cookie", (req, res) => {
  console.log("req.cookies", req.cookies);
  res.send("done");
});
app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(
    `\u001b[32m🍺🍺🍺🍺🍺🍺🍺🍺 Порт \u001b[35m${PORT} \u001b[32mзавёлся 🍺🍺🍺🍺🍺🍺🍺🍺`
  );
});
