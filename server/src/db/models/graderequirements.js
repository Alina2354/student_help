"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GradeRequirements extends Model {
    static associate(models) {
      GradeRequirements.belongsTo(models.Teacher, {
        foreignKey: "teacher_id",
        as: "teacher",
      });
      GradeRequirements.belongsTo(models.Discipline, {
        foreignKey: "discipline_id",
        as: "discipline",
      });
    }
  }
  GradeRequirements.init(
    {
      teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Teachers",
          key: "id",
        },
      },
      discipline_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Disciplines",
          key: "id",
        },
      },
      semester: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      requirements_5: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      requirements_4: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      requirements_3: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "GradeRequirements",
    }
  );
  return GradeRequirements;
};
