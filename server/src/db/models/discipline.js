"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Discipline extends Model {
    static associate(models) {
      Discipline.belongsTo(models.Teacher, {
        foreignKey: "teacher_id",
        as: "teacher",
      });
    }
  }
  Discipline.init(
    {
      teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Teachers",
          key: "id",
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      semester: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Discipline",
    }
  );
  return Discipline;
};
