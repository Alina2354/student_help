import React from "react";
import TaskList from "../../widgets/tasksList/TaskList";
import "./TaskPage.module.css";

export default function TaskPage({user}) {
  return (
    <div className="page_tasks">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1 className="title_page">Задачи:</h1>
      </div>
      <TaskList user={user} />
    </div>
  );
}
