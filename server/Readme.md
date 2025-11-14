Сущность TASK

1. Создаем миграцию и модель задач

```
npx sequelize model:generate --name Task --attributes title:string,description:string
```

2. Создаем базу данных DbTask:

```
npm run db:reset
```

3. Создаем в папке utils файл FormatResponse.js(Делаем так, чтобы наш бек всегда отвечал ОБЪЕКТОМ с 4 ключами из любой ручки: data, statusCode, message, error), в нем код:

```
function formatResponse(statusCode, message, data = null, error = null) {
  return {
    statusCode,
    message,
    data, // если не придет будет null
    error, // если не придет будет null
  };
}
module.exports = formatResponse;

```

4. Создаем в папке utils файл isValidId.js(Вернет true, если id — это число (или значение, которое можно преобразовать в число), и false — если это не число (например, строка, объект, null, undefined, и т. д.).), в нем код:

```
function isValidId(id) {
  return !isNaN(id);
}
module.exports = isValidId;

```

**_ Пример работы isValidId.js _**
console.log(checkId(123)); // true
console.log(checkId("456")); // true (строка, но преобразуется в число)
console.log(checkId("abc")); // false
console.log(checkId(undefined)) // false

5. В файле task.js в папке models, вставляем проверку на валидность задачи, вставляем после метода "static associate(models) {}" и до Task.init

```
      static validate({ title, description }) {
      if (!title || typeof title !== "string" || title.trim().length === 0) {
        return {
          isValid: false,
          error: "Название задачи должно быть непустой строкой",
        };
      }
      if (
        !description ||
        typeof description !== "string" ||
        description.trim().length === 0
      ) {
        return {
          isValid: false,
          error: "Описание задачи должно быть непустой строкой",
        };
      }

      return {
        isValid: true,
        error: null,
      };
    }


```

6. Cоздаем в папке services файл Task.service.js(файл отвечающий только за запросы в базу данных), вставляем в него код:

```
const { Task } = require("../db/models");

class TaskService {
  static async getAll() {
    return await Task.findAll();
  }

  static async getById(id) {
    return await Task.findByPk(id)
  }

  static async create(data) {
    return await Task.create(data);
  }

  static async updateById(id, data) {
    const { title, description } = data;
    const task = await this.getById(id);

    if (title) {
      task.title = title;
    }
    if (description) {
      task.description = description;
    }
    await task.save();
    return task;
  }

  static async deleteById(id) {
    return await Task.destroy({ where: { id } });
  }
}

module.exports = TaskService;

```

7. Создаем в папке controllers файл Task.controller.js вставляем в него код:

```
const TaskService = require("../services/Task.service");
const isValidId = require("../utils/isValidId");
const formatResponse = require("../utils/formatResponse");
const { Task: TaskValidator } = require("../db/models"); // Переименовываем модель

class TaskController {
  // GET ALL
  static async getAll(req, res) {
    try {
      const tasks = await TaskService.getAll();
      if (!tasks) {
        return res
          .status(500)
          .json(formatResponse(500, "Не удалось получить данные."));
      }
      if (tasks.length === 0) {
        return res
          .status(200)
          .json(formatResponse(204, "Нет данных по задачам.", []));
      }
      return res
        .status(200)
        .json(formatResponse(200, "Успешное получение данных.", tasks));
    } catch ({ message }) {
      console.error("========TaskController.getAll========\n", message);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера.", null, message));
    }
  }
  //GET Id
  static async getById(req, res) {
    try {
      const { id } = req.params;

      if (!isValidId(id)) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              "Не удалось получить задачу.",
              null,
              "Не правильно передан параметр для поиска."
            )
          );
      }
      const task = await TaskService.getById(id);

      if (!task) {
        return res
          .status(404)
          .json(
            formatResponse(
              404,
              "Не удалось получить задачу.",
              null,
              `Задача с ${id} не найдена.`
            )
          );
      }
      return res
        .status(200)
        .json(
          formatResponse(200, "Успешное получение данных по задаче.", task)
        );
    } catch ({ message }) {
      console.error("========TaskController.getById========\n", message);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера.", null, message));
    }
  }

  // Create
  static async create(req, res) {
    try {
      const { title, description } = req.body;

      const { isValid, error } = TaskValidator.validate({ title, description });

      if (!isValid) {
        return res.status(400).json(formatResponse(400, error, null, error));
      }

      const newTask = await TaskService.create({ title, description });

      if (!newTask)
        return res
          .status(500)
          .json(
            formatResponse(
              500,
              "Не удалось создать задачу.",
              null,
              "Не удалось создать задачу."
            )
          );

      return res
        .status(201)
        .json(formatResponse(201, "Задача успешно создана.", newTask));
    } catch ({ message }) {
      console.error("========TaskController.create========\n", message);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера.", null, message));
    }
  }

  //Update
  static async updateById(req, res) {
    try {
      const { id } = req.params;

      if (!req.body) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              "Тело запроса отсутствует.",
              null,
              "req.body is missing"
            )
          );
      }
      const { title, description } = req.body; //! перекрыть отсутствие тела!!!!!!!!!!!!!!!!!!!!!!!!!!! 2:32

      if (!isValidId(id)) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              "Не валидный id.",
              null,
              "Не удалось изменить задачу"
            )
          );
      }

      const { isValid, error } = TaskValidator.validate({
        title,
        description,
      });

      if (!isValid) {
        return res.status(400).json(formatResponse(400, error, null, error));
      }

      const updatedTask = await TaskService.updateById(+id, {
        title,
        description,
      });

      if (!updatedTask) {
        return res
          .status(404)
          .json(
            formatResponse(
              404,
              "Не удалось изменить или получить задачу",
              null,
              `задача ${id} не найдена или не была изменена`
            )
          );
      }

      return res
        .status(200)
        .json(formatResponse(200, "Задача успешно обновлена", updatedTask));
    } catch ({ message }) {
      console.error("========TaskController.updateById========\n", message);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера.", null, message));
    }
  }

  //Delete
  static async deleteById(req, res) {
    try {
      const { id } = req.params;

      if (!isValidId(id)) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              "Не удалось удалить задачу",
              null,
              "Не валидный id"
            )
          );
      }
      const deletedTask = await TaskService.deleteById(+id);
      if (!deletedTask) {
        return res
          .status(404)
          .json(
            formatResponse(
              404,
              "Не удалось удалить или получить задачу",
              null,
              `Задача ${id} не найдена или не была удалена`
            )
          );
      }
      return res
        .status(200)
        .json(formatResponse(200, "Задача успешно удалена"));
    } catch ({ message }) {
      console.error("========TaskController.deleteById========\n", message);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера.", null, message));
    }
  }
}

module.exports = TaskController;

```

8. Создаем в папке routes файл tasks.routes.js вставляем в него код:

```
const router = require("express").Router();
const TaskController = require("../controllers/Task.controller");

router
  .get("/", TaskController.getAll)
  .get("/:id", TaskController.getById)
  .post("/", TaskController.create)
  .put("/:id", TaskController.updateById)
  .delete("/:id", TaskController.deleteById);

module.exports = router;

```

9. Создаем в папке routes файл api.routes.js вставляем в него код:

```
const router = require("express").Router();

const tasksRoutes = require("../routes/tasks.routes");
const formatResponse = require("../utils/formatResponse");

router.use("/tasks", tasksRoutes);

router.use((req, res) => {
  res
    .status(404)
    .json(
      formatResponse(404, "Страница не найдена", null, "Маршрут не найден")
    );
});

module.exports= router;

```

10. В файл app.js вставляем код:

```
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
const express = require("express");
const serverConfig = require("./config/serverConfig"); // добавил после создания serverConfig.js
const apiRoutes = require("./routes/api.routes");

const { PORT } = process.env || 3000;

const app = express();

serverConfig(app) // добавил после создания serverConfig.js

app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});


```

11. Создаем в папке config файл serverConfig.js, вставляем туда код:

```
const express = require("express");
const morgan = require("morgan");
const removeXPoweredBy = require("../middlewares/removeHeader");
const path = require("path");

const serverConfig = (app) => {
  app.use(express.urlencoded({ extended: true })); // мидлварка для чтения тела
  app.use(express.json()); // мидлварка для чтения json
  app.use(removeXPoweredBy); // добавил после создания мидлварки - удаление заголовка
  app.use(morgan("dev")); // мидлварка для логирования
  app.use("/files", express.static(path.resolve(__dirname, "..", "public"))); // мидлаварка - умеет отдавать все файлы(картинки) в папке public, по пути "/files"
};

module.exports = serverConfig;

```

12. Создаем в папке middlewares файл removeHeader.js, вставляем туда код:

```
function removeXPoweredBy(req, res, next) {
  res.removeHeader("x-powered-by");
  next();
}
module.exports = removeXPoweredBy;

```
13. Для запуска создать файл .env в папке сервис

```
DB=postgres://andrey_ivanov:XXXX@localhost:XXXX/DbTask
PORT=XXXX

```
