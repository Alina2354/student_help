const express = require("express");

const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const removeXPoweredBy = require("../middlewares/removeHeader");


const serverConfig = (app) => {
  // Сначала body-парсеры

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS
  app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

  // Служебные мидлвары
  app.use(removeXPoweredBy);
  app.use(cookieParser());
  app.use(morgan("dev"));
};
// Static — ДОЛЖЕН быть в serverConfig

module.exports = serverConfig;
