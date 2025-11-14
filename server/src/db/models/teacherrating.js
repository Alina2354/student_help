"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TeacherRating extends Model {
    static associate(models) {
      TeacherRating.belongsTo(models.Teacher, {
        foreignKey: "teacher_id",
        as: "teacher",
      });
    }
  }
  TeacherRating.init(
    {
      teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Teachers",
          key: "id",
        },
      },
      rating5: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      rating4: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      rating3: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "TeacherRating",
    }
  );
  return TeacherRating;
};
