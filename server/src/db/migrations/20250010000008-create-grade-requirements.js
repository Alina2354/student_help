/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("GradeRequirements", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      teacher_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Teachers",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      discipline_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Disciplines",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      semester: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      requirements_5: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      requirements_4: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      requirements_3: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("GradeRequirements");
  },
};
