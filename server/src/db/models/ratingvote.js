"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RatingVote extends Model {
    static associate(models) {
      RatingVote.belongsTo(models.Teacher, {
        foreignKey: "teacher_id",
        as: "teacher",
      });
      RatingVote.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  RatingVote.init(
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
      rating_type: {
        type: DataTypes.ENUM("rating5", "rating4", "rating3"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "RatingVote",
      indexes: [
        {
          unique: true,
          fields: ["teacher_id", "user_id"],
        },
      ],
    }
  );
  return RatingVote;
};
