import { useState } from "react";
import tasksData from "../data/tasks";

const useTasks = () => {
  const [tasks, setTasks] = useState(tasksData);

  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return {
    tasks,
    addTask,
    deleteTask,
  };
};

export default useTasks;