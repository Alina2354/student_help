import React, { useEffect, useState } from "react";
import TaskForm from "../taskForm/TaskForm";
import TaskApi from "../../entites/task/api/TaskApi";

export default function TaskList({user}) {
  const [tasks, setTasks] = useState([]);

  async function deleteTaskHandler(id) {
    try {
      await TaskApi.deleteTask(id); //запрос на бекенд удаление (ниже он уже удалил)

      setTasks((prev) => prev.filter((task) => task.id !== id)); //обновляю стейт
    } catch (error) {
      console.log(error, "Не удалось удалить задачу");
    }
  }

  const fetchTasks = async () => {
    try {
      const tasks = await fetch("http://localhost:3000/api/tasks"); // сделал запрос данных
      const result = await tasks.json(); // распарсил в json данные
      setTasks(result.data); // обновляем локальное состояние компонента
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  function startEdit(id, title, description) {
    // начать редактирование
    setEditId(id);
    setEditTitle(title);
    setEditDescription(description);
  }

  async function saveEdit() {
    try {
      const response = await TaskApi.editTask(editId, {
        title: editTitle,
        description: editDescription,
      });

      setTasks((prev) =>
        prev.map((task) => (task.id === editId ? response.data.data : task))
      );
      setEditId(null);
    } catch (error) {
      console.log(error);
    }
  }

  function cancelEdit() {
    // закрытие
    setEditId(null);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "40px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {tasks.map((task) => (
          <div className="forma_task" key={task.id}>
            {editId === task.id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
                <button onClick={saveEdit}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <h2>{task.title}</h2>
                <p>{task.description}</p>
                <button onClick={() => deleteTaskHandler(task.id)}>
                  Delete
                </button>
                <button
                  onClick={() =>
                    startEdit(task.id, task.title, task.description)
                  }
                >
                  Update
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      <TaskForm setTasks={setTasks} user={user} />
    </div>
  );
}
