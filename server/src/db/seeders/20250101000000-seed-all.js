"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    //
    // 1. USERS
    //
    const users = [
      {
        name: "Иван Петров",
        email: "ivan@example.com",
        password: await bcrypt.hash("Password1!", 10),
        is_admin: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Мария Кузнецова",
        email: "maria@example.com",
        password: await bcrypt.hash("Password1!", 10),
        is_admin: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Сергей Иванов",
        email: "sergey@example.com",
        password: await bcrypt.hash("Password1!", 10),
        is_admin: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Анна Смирнова",
        email: "anna@example.com",
        password: await bcrypt.hash("Password1!", 10),
        is_admin: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Andrew",
        email: "Andrew310196@icloud.com",
        password: await bcrypt.hash("Andrew310196@icloud.com", 10),
        is_admin: true,
        createdAt: now,
        updatedAt: now,
      },
    ];

    const insertedUsers = await queryInterface.bulkInsert("Users", users, {
      returning: true,
    });

    const [u1, u2, u3] = insertedUsers;

    //
    // 2. TEACHERS
    //
    const teachers = [
      {
        first_name: "Александр",
        last_name: "Сергеев",
        middle_name: "Павлович",
        faculty: "ФКТИ",
        department: "Программирование",
        avatar: "http://localhost:3000/files/avatars/IMG_5445 1.svg",
        createdAt: now,
        updatedAt: now,
      },
      {
        first_name: "Екатерина",
        last_name: "Соколова",
        middle_name: "Игоревна",
        faculty: "ФКТИ",
        department: "Информационные системы",
        avatar: "http://localhost:3000/files/avatars/IMG_5454 1.svg",
        createdAt: now,
        updatedAt: now,
      },
      {
        first_name: "Максим",
        last_name: "Орлов",
        middle_name: "Андреевич",
        faculty: "ФКТИ",
        department: "Кибербезопасность",
        avatar: "http://localhost:3000/files/avatars/IMG_5457 1.svg",
        createdAt: now,
        updatedAt: now,
      },
      {
        first_name: "Наталья",
        last_name: "Романова",
        middle_name: "Владимировна",
        faculty: "ФКТИ",
        department: "Математика",
        avatar: "http://localhost:3000/files/avatars/IMG_5465 1.svg",
        createdAt: now,
        updatedAt: now,
      },
      {
        first_name: "Дмитрий",
        last_name: "Федоров",
        middle_name: "Викторович",
        faculty: "ФКТИ",
        department: "Физика",
        avatar: "http://localhost:3000/files/avatars/IMG_5455 1.svg",
        createdAt: now,
        updatedAt: now,
      },
    ];

    const insertedTeachers = await queryInterface.bulkInsert(
      "Teachers",
      teachers,
      {
        returning: true,
      }
    );

    const [t1, t2, t3, t4, t5] = insertedTeachers;

    //
    // 3. DISCIPLINES — строго 3 на каждого
    //
    const disciplines = [
      // teacher 1
      {
        teacher_id: t1.id,
        title: "Дискретная математика",
        semester: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        teacher_id: t1.id,
        title: "Базы данных",
        semester: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        teacher_id: t1.id,
        title: "Алгоритмы",
        semester: 3,
        createdAt: now,
        updatedAt: now,
      },

      // teacher 2
      {
        teacher_id: t2.id,
        title: "Программирование JS",
        semester: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        teacher_id: t2.id,
        title: "Информационная безопасность",
        semester: 4,
        createdAt: now,
        updatedAt: now,
      },
      {
        teacher_id: t2.id,
        title: "Сети и протоколы",
        semester: 5,
        createdAt: now,
        updatedAt: now,
      },

      // teacher 3
      {
        teacher_id: t3.id,
        title: "Операционные системы",
        semester: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        teacher_id: t3.id,
        title: "Криптография",
        semester: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        teacher_id: t3.id,
        title: "Практика backend",
        semester: 4,
        createdAt: now,
        updatedAt: now,
      },

      // teacher 4
      {
        teacher_id: t4.id,
        title: "Математический анализ",
        semester: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        teacher_id: t4.id,
        title: "Физика",
        semester: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        teacher_id: t4.id,
        title: "Моделирование",
        semester: 3,
        createdAt: now,
        updatedAt: now,
      },

      // teacher 5
      {
        teacher_id: t5.id,
        title: "Архитектура ПО",
        semester: 4,
        createdAt: now,
        updatedAt: now,
      },
      {
        teacher_id: t5.id,
        title: "Структуры данных",
        semester: 5,
        createdAt: now,
        updatedAt: now,
      },
      {
        teacher_id: t5.id,
        title: "Алгоритмические методы",
        semester: 6,
        createdAt: now,
        updatedAt: now,
      },
    ];

    const insertedDisciplines = await queryInterface.bulkInsert(
      "Disciplines",
      disciplines,
      { returning: true }
    );

    //
    // 4. GRADE REQUIREMENTS (по 3 для каждого предмета)
    //
    const gradeReq = insertedDisciplines.flatMap((d) => [
      {
        teacher_id: d.teacher_id,
        discipline_id: d.id,
        semester: d.semester,
        requirements_5: "Хотя бы приди на экзамен (по возможности)",

        requirements_4: "Ну постарайся, но не так сильно",
        requirements_3:
        'Крикни в окно "Халява приди" 3 раза\nПостучи зачеткой об пол\nСтанцуй под песню "Все будет хорошо" и иди спать!',
      

        createdAt: now,

        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("GradeRequirements", gradeReq);

    //
    // 5. TEACHER RATINGS
    //
    const ratings = [
      {
        teacher_id: t1.id,
        rating5: 5,
        rating4: 3,
        rating3: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        teacher_id: t2.id,
        rating5: 7,
        rating4: 2,
        rating3: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        teacher_id: t3.id,
        rating5: 6,
        rating4: 3,
        rating3: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        teacher_id: t4.id,
        rating5: 4,
        rating4: 4,
        rating3: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        teacher_id: t5.id,
        rating5: 8,
        rating4: 1,
        rating3: 1,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("TeacherRatings", ratings);

    //
    // 6. RATING VOTES — строго уникальные
    //
    const votes = [
      {
        teacher_id: t1.id,
        user_id: u1.id,
        rating_type: "rating5",
        createdAt: now,
        updatedAt: now,
      },
      {
        teacher_id: t2.id,
        user_id: u2.id,
        rating_type: "rating4",
        createdAt: now,
        updatedAt: now,
      },
      {
        teacher_id: t3.id,
        user_id: u3.id,
        rating_type: "rating3",
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("RatingVotes", votes);

    //
    // 7. CHAT MESSAGES
    //
    const messages = [
      {
        user_id: u1.id,
        sender: "user",
        content: "Здравствуйте! Подскажите по курсу?",
        createdAt: now,
        updatedAt: now,
      },
      {
        user_id: u1.id,
        sender: "assistant",
        content: "Слушаю вас.",
        createdAt: now,
        updatedAt: now,
      },

      {
        user_id: u2.id,
        sender: "user",
        content: "Не понимаю алгоритмы",
        createdAt: now,
        updatedAt: now,
      },
      {
        user_id: u2.id,
        sender: "assistant",
        content: "Могу объяснить подробнее.",
        createdAt: now,
        updatedAt: now,
      },

      {
        user_id: null,
        sender: "user",
        content: "Я гость, помогите найти преподавателя",
        createdAt: now,
        updatedAt: now,
      },
      {
        user_id: null,
        sender: "assistant",
        content: "Уточните имя преподавателя.",
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("ChatMessages", messages);

    //
    // 8. FAQ
    //
    const faqs = [
      {
        teacher_id: t1.id,
        user_id: u1.id,
        text: "Как проходит экзамен?",
        answer: "Экзамен проходит письменно, длится 90 минут.",
        file_path: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        teacher_id: t2.id,
        user_id: u2.id,
        text: "Будет ли пересдача?",
        answer: "Пересдача доступна один раз в конце семестра.",
        file_path: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        teacher_id: t3.id,
        user_id: u3.id,
        text: "Доступны ли конспекты?",
        answer: "Да, конспекты доступны в Google Drive.",
        file_path: null,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("Faqs", faqs);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Faqs", null, {});
    await queryInterface.bulkDelete("ChatMessages", null, {});
    await queryInterface.bulkDelete("RatingVotes", null, {});
    await queryInterface.bulkDelete("TeacherRatings", null, {});
    await queryInterface.bulkDelete("GradeRequirements", null, {});
    await queryInterface.bulkDelete("Disciplines", null, {});
    await queryInterface.bulkDelete("Teachers", null, {});
    await queryInterface.bulkDelete("Users", null, {});
  },
};
