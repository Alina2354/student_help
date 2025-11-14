1. Установить все модули:

```
npm i

```

2. Создать в папке widgest папку tasksList, а в ней два два файла: TaskList.css и TaskList.jsx

3. В файл TaskList.jsx вставляем код:

```
import React, { useState } from "react";
import TaskForm from "../taskForm/TaskForm";

const initialTasks = [
  { id: 1, title: "Task 1", description: "description 1" },
  { id: 2, title: "Task 2", description: "description 2" },
  { id: 3, title: "Task 3", description: "description 3" },
];

export default function TaskList() {
  const [tasks, setTasks] = useState(initialTasks);

  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id}>
          <h2>{task.title}</h2>
          <p>{task.description}</p>
        </div>
      ))}
    </div>
  );
}

```

4. В файл App.jsx вставляем созданный фрагмент TaskList:

```
import HomePage from "./pages/home/HomePages";
import { Route, Routes } from "react-router-dom";
import TaskList from "./widgets/tasksList/TaskList";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<HomePage />} />
      </Routes>
      <div>
        <TaskList />
      </div>
    </>
  );
}
export default App;

```

5. Создаем в папке widgest папку tasksForm, в ней файл TaskForm.jsx, туда вставляем код:

```

import React from 'react'
import { Form } from 'react-router-dom'

// button type='submit' При нажатии на такую кнопку срабатывает событие submit, которое запускает процесс отправки всех данных из формы на указанный серверный скрипт (обработчик формы). Это форма по дефолту перегружает страницу - это дефолтное поведение формы

export default function TaskForm() {
  return (
    <form>
      <input type="text" placeholder='Title' name='title'/>
      <input type="text" placeholder='Description' name='description'/>
      <button type='submit'>Create task</button>
    </form>
  )
}

```

6. Внутри формы в файле TaskForm.jsx нужно завести состояние, вот код:

```
import React, { useState } from "react";
import { Form } from "react-router-dom";

// button type='submit' При нажатии на такую кнопку срабатывает событие submit, которое запускает процесс отправки всех данных из формы на указанный серверный скрипт (обработчик формы).

// запретили менять изначальное значение (value={titleInput}) + добавили event(изменение значение в интпуте) - onChange(событие на кей даун или кей пресс)={(e) => setTitleInput(e.target.value(текущее состояние в дом))}

// можно вынести в отдельный чендж хендлер(функция ручка, которая должна отработать по клику или событию на что-то) - onChange={(e) => setTitleInput(e.target.value)}

export default function TaskForm() {

  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");

  function submitHandler(e){ // функция, которая запрещает изменять изначальное значение, перегружаться странице, подключаем в теге <form onSubmit={submitHandler}>;

    e.preventDefault();
  }

  return (
    <form onSubmit={submitHandler}>
      <input
        type="text"
        placeholder="Title"
        name="title"
        value={titleInput}
        onChange={(e) => setTitleInput(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        name="description"
        value={descriptionInput}
        onChange={(e) => setDescriptionInput(e.target.value)}
      />
      <button type="submit">Create task</button>
    </form>
  );
}

```

7. Создаем задачу в файле TaskList.jsx в форму TaskForm добавляем код:

```
<TaskForm setTasks={setTasks}/>

```

8. В файле TaskForm.jsx принять эту форму, добавляем код:

```
export default function TaskForm({setTask}) {

```

и в function submitHandler(e) добавляем код:

// вызывается функция setTasks и меняется состояние хранения всех задач, принимает предыдущие состояние(массив с тремя объектами) и вместо него делаем новый массив, который сначала распредит предыдущее состояние, а потом положит туда еще одну задачку с

      setTasks((prev) => [ // не потеряй предыдущее состояние
      ...prev,
      { id: prev.length + 1, title: titleInput, description: descriptionInput },
    ]);

setTitleInput("");
setDescriptionInput(""); // после чего сбрасывает форму

```
 function submitHandler(e) {
    e.preventDefault();

    setTasks((prev) => [
      ...prev,
      { id: prev.length + 1, title: titleInput, description: descriptionInput },
    ]);

    setTitleInput("");
    setDescriptionInput("");

  }

```

9. Нужно проверить теперь инпуты:

// в функции - function submitHandler(e) {
после строки - e.preventDefault();
добавить проверку или проверки:

```
    if( titleInput.length < 3 || descriptionInput.length < 3) {
      alert("Неверные title или description")
      return
    }
```

10. Добавляем кнопку удалить в каждой задаче, в файле TaskList.jsx в <div>:

```
       <div key={task.id}>
          <h2>{task.title}</h2>
          <p>{task.description}</p>
          <button>Delete</button>
        </div>
```

11. Добавляем функцию в файле TaskList.jsx:
// функция удаления задачи из массива задач, по которой кликаем
//
prev.filter(...) — создаёт новый массив (иммутабельное обновление), оставляя только те элементы, для которых условие истинно.

(task) => task.id !== id — условие фильтра: исключаем задачу, у которой task.id строго не равен (!==) переданному id.

```
  function deleteTaskHandler(id) { // принимает id задачи, которую надо удалить
    setTasks((prev) => prev.filter((task) => task.id !== id)); берет и фильтрует предыдущее состояние и удаляет задачу, оставляет id, которые не равны приходящему id
  }

```

12. Добавляем в файле TaskList.jsx в кнопку <button>Delete</button> код(функцию OnClick):

```
<button onClick={() => deleteTaskHandler(task.id)}>Delete</button>

```

10. Добавляем кнопку изменить в каждой задаче, в файле TaskList.jsx в <div>:

```
<button>Update</button>

```

11.





