const express = require("express");

const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const removeXPoweredBy = require("../middlewares/removeHeader");

const serverConfig = (app) => {
  app.use(express.json()); // мидлварка для чтения json
  app.use(cors({ origin: [process.env.CLIENT_URL], credentials: true }));
  app.use(express.urlencoded({ extended: true })); // мидлварка для чтения тела
  app.use(removeXPoweredBy); // добавил после создания мидлварки - удаление заголовка
  app.use(morgan("dev")); // мидлварка для логирования
  app.use(cookieParser());
  app.use("/files", express.static(path.resolve(__dirname, "..", "public"))); // мидлаварка - умеет отдавать все файлы(картинки) в папке public, по пути "/files"
};

module.exports = serverConfig