"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    //
    // 1. USERS (5 шт.)
    //
    const users = [
      {
        id: 1,
        name: "Иван Петров",
        email: "ivan@example.com",
        password: await bcrypt.hash("Password1!", 10),
        is_admin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "Мария Кузнецова",
        email: "maria@example.com",
        password: await bcrypt.hash("Password1!", 10),
        is_admin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: "Сергей Иванов",
        email: "sergey@example.com",
        password: await bcrypt.hash("Password1!", 10),
        is_admin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: "Анна Смирнова",
        email: "anna@example.com",
        password: await bcrypt.hash("Password1!", 10),
        is_admin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        name: "Andrew",
        email: "Andrew310196@icloud.com",
        password: await bcrypt.hash("Andrew310196@icloud.com", 10),
        is_admin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Users", users);

    //
    // 2. TEACHERS (5 шт.)
    //
    const teachers = [
      { id: 1, first_name: "Александр", last_name: "Сергеев", middle_name: "Павлович", faculty: "ФКТИ", department: "Программирование", createdAt: new Date(), updatedAt: new Date() },
      { id: 2, first_name: "Екатерина", last_name: "Соколова", middle_name: "Игоревна", faculty: "ФКТИ", department: "Информационные системы", createdAt: new Date(), updatedAt: new Date() },
      { id: 3, first_name: "Максим", last_name: "Орлов", middle_name: "Андреевич", faculty: "ФКТИ", department: "Кибербезопасность", createdAt: new Date(), updatedAt: new Date() },
      { id: 4, first_name: "Наталья", last_name: "Романова", middle_name: "Владимировна", faculty: "ФКТИ", department: "Математика", createdAt: new Date(), updatedAt: new Date() },
      { id: 5, first_name: "Дмитрий", last_name: "Федоров", middle_name: "Викторович", faculty: "ФКТИ", department: "Физика", createdAt: new Date(), updatedAt: new Date() },
    ];

    await queryInterface.bulkInsert("Teachers", teachers);

    //
    // 3. DISCIPLINES (по 3 на преподавателя)
    //
    const disciplines = [
      // teacher 1
      { id: 1, teacher_id: 1, title: "Дискретная математика", semester: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, teacher_id: 1, title: "Базы данных", semester: 2, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, teacher_id: 1, title: "Алгоритмы", semester: 3, createdAt: new Date(), updatedAt: new Date() },

      // teacher 2
      { id: 4, teacher_id: 2, title: "Программирование JS", semester: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: 5, teacher_id: 2, title: "Информационная безопасность", semester: 4, createdAt: new Date(), updatedAt: new Date() },
      { id: 6, teacher_id: 2, title: "Сети и протоколы", semester: 5, createdAt: new Date(), updatedAt: new Date() },

      // teacher 3
      { id: 7, teacher_id: 3, title: "Операционные системы", semester: 2, createdAt: new Date(), updatedAt: new Date() },
      { id: 8, teacher_id: 3, title: "Криптография", semester: 3, createdAt: new Date(), updatedAt: new Date() },
      { id: 9, teacher_id: 3, title: "Практика backend", semester: 4, createdAt: new Date(), updatedAt: new Date() },

      // teacher 4
      { id: 10, teacher_id: 4, title: "Математический анализ", semester: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: 11, teacher_id: 4, title: "Физика", semester: 2, createdAt: new Date(), updatedAt: new Date() },
      { id: 12, teacher_id: 4, title: "Моделирование", semester: 3, createdAt: new Date(), updatedAt: new Date() },

      // teacher 5
      { id: 13, teacher_id: 5, title: "Архитектура ПО", semester: 4, createdAt: new Date(), updatedAt: new Date() },
      { id: 14, teacher_id: 5, title: "Структуры данных", semester: 5, createdAt: new Date(), updatedAt: new Date() },
      { id: 15, teacher_id: 5, title: "Алгоритмические методы", semester: 6, createdAt: new Date(), updatedAt: new Date() },
    ];

    await queryInterface.bulkInsert("Disciplines", disciplines);

    //
    // 4. TEACHER RATINGS
    //
    const ratings = [
      { teacher_id: 1, rating5: 5, rating4: 3, rating3: 1, createdAt: new Date(), updatedAt: new Date() },
      { teacher_id: 2, rating5: 7, rating4: 2, rating3: 1, createdAt: new Date(), updatedAt: new Date() },
      { teacher_id: 3, rating5: 6, rating4: 3, rating3: 2, createdAt: new Date(), updatedAt: new Date() },
      { teacher_id: 4, rating5: 4, rating4: 4, rating3: 3, createdAt: new Date(), updatedAt: new Date() },
      { teacher_id: 5, rating5: 8, rating4: 1, rating3: 1, createdAt: new Date(), updatedAt: new Date() },
    ];

    await queryInterface.bulkInsert("TeacherRatings", ratings);

    //
    // 5. CHAT MESSAGES (фиксированный набор)
    //
    const messages = [
      { user_id: 1, sender: "user", content: "Здравствуйте! Подскажите по ДМ?", createdAt: new Date(), updatedAt: new Date() },
      { user_id: 1, sender: "assistant", content: "Конечно, слушаю вас.", createdAt: new Date(), updatedAt: new Date() },

      { user_id: 2, sender: "user", content: "Не понимаю алгоритмы", createdAt: new Date(), updatedAt: new Date() },
      { user_id: 2, sender: "assistant", content: "Могу объяснить подробнее.", createdAt: new Date(), updatedAt: new Date() },

      { user_id: 3, sender: "user", content: "Как решать задачи?", createdAt: new Date(), updatedAt: new Date() },
      { user_id: 3, sender: "assistant", content: "Давайте разберём пример.", createdAt: new Date(), updatedAt: new Date() },
    ];

    await queryInterface.bulkInsert("ChatMessages", messages);

    //
    // 6. FAQ (фиксированный набор)
    //
    const faqs = [
      { teacher_id: 1, user_id: 1, text: "Как сдаётся экзамен?", createdAt: new Date(), updatedAt: new Date() },
      { teacher_id: 2, user_id: 2, text: "Будет ли пересдача?", createdAt: new Date(), updatedAt: new Date() },
      { teacher_id: 3, user_id: 3, text: "Есть ли конспекты лекций?", createdAt: new Date(), updatedAt: new Date() },
    ];

    await queryInterface.bulkInsert("Faqs", faqs);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Faqs", null, {});
    await queryInterface.bulkDelete("ChatMessages", null, {});
    await queryInterface.bulkDelete("TeacherRatings", null, {});
    await queryInterface.bulkDelete("Disciplines", null, {});
    await queryInterface.bulkDelete("Teachers", null, {});
    await queryInterface.bulkDelete("Users", null, {});
  }
};
