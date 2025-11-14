"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    static associate(models) {
      Teacher.hasMany(models.Discipline, {
        foreignKey: "teacher_id",
        as: "disciplines",
      });
      Teacher.hasMany(models.TeacherRating, {
        foreignKey: "teacher_id",
        as: "ratings",
      });
      Teacher.hasMany(models.Faq, {
        foreignKey: "teacher_id",
        as: "faqs",
      });
    }
  }
  Teacher.init(
    {
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      middle_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      faculty: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      department: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Teacher",
    }
  );
  return Teacher;
};
