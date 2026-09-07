import { useState } from "react";
import "./Tasks.css";

import TaskBoard from "../../components/Tasks/TaskBoard/TaskBoard";
import AddTaskModal from "../../components/Tasks/AddTaskModal/AddTaskModal";

import tasksData from "../../data/tasks";

const Tasks = () => {
  const [tasks, setTasks] = useState(tasksData);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="tasks-page">

      <div className="tasks-header">
        <h1>Task Management</h1>

        <button
          className="add-task-btn"
          onClick={() => setIsModalOpen(true)}
        >
          + New Task
        </button>
      </div>

      <TaskBoard
  tasks={tasks}
  onDelete={deleteTask}
/>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={addTask}
      />

    </div>
  );
};

export default Tasks;