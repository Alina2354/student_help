"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Faq extends Model {
    static associate(models) {
      Faq.belongsTo(models.Teacher, {
        foreignKey: "teacher_id",
        as: "teacher",
      });
      Faq.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  Faq.init(
    {
      teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Teachers",
          key: "id",
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Faq",
    }
  );
  return Faq;
};
