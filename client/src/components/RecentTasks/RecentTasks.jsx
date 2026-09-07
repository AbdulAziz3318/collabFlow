import "./RecentTasks.css";
import { useEffect, useState } from "react";
import { getRecentTasks } from "../../../services/dashboardService";

const RecentTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await getRecentTasks();
      setTasks(res.data.slice(0, 5));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="recent-tasks">
      <h2>Recent Tasks</h2>

      {tasks.map((task) => (
        <p key={task.id}>✅ {task.title}</p>
      ))}
    </div>
  );
};

export default RecentTasks;