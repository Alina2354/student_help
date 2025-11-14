import React, { useState } from "react";

import "./TaskForm.module.css";
import TaskApi from "../../entites/task/api/TaskApi";

export default function TaskForm({ setTasks, user }) {
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");

  async function submitHandler(event) {
    event.preventDefault(); // отключаем изначальное состояние
    
    if (titleInput.length < 1 || descriptionInput.length < 1) {
      alert("Неверные title или description");
      return;
    }

    const response = await TaskApi.createTask({
      title: titleInput,
      description: descriptionInput,
      id: user.data.id
    });

    setTasks((prev) => [
      // тут мы обновляем стейт, чтобы изменилась отрисовка на клиенте
      ...prev,
      response.data.data,
    ]);

    setTitleInput("");
    setDescriptionInput("");
  }

  return (
    <div>
      <form onSubmit={submitHandler}>
        <div className="container_task">
          <div>
            <h4 className="title_create">Создать задачу</h4>
          </div>
          <div className="input">
            <div>
              <input
                type="text"
                placeholder="Title"
                name="title"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Description"
                name="description"
                value={descriptionInput}
                onChange={(e) => setDescriptionInput(e.target.value)}
              />
            </div>
            <div>
              <button type="submit">Создать задачу</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
