const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./db/models");

const serverConfig = require("./config/serverConfig");
const apiRoutes = require("./routes/api.routes");
const aiRoute = require("../src/routes/ai.route");

const app = express();

const { PORT = 3000 } = process.env;

// --- CORS ДОЛЖЕН БЫТЬ СРАЗУ ПОСЛЕ express() ---
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// --- БАЗА ДАННЫХ ---
(async () => {
  try {
    await sequelize.authenticate();
    console.log("\u001b[32m✅ Подключение к базе данных успешно\u001b[0m");
  } catch (error) {
    console.error(
      "\u001b[31m❌ Ошибка подключения к базе данных:\u001b[0m",
      error.message
    );
  }
})();

// --- ROUTES ---
app.use("/api/ai", aiRoute);

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

// --- OSTALNOE ---
serverConfig(app);
app.use("/api", apiRoutes);

app.use("/files", express.static(path.resolve(__dirname, "..", "public")));

app.listen(PORT, () => {
  console.log(`\u001b[32m🍺 Сервер запущен на порту ${PORT} 🍺\u001b[0m`);
});
