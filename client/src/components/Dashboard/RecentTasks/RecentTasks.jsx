import {
  useEffect,
  useState,
} from "react";

import "./RecentTasks.css";

import {
  getRecentTasks,
} from "../../../services/dashboardService";

const RecentTasks = () => {
  const [tasks, setTasks] =
    useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response =
          await getRecentTasks();

        setTasks(
          response.data.slice(0, 5)
        );
      } catch (error) {
        console.error(error);
      }
    };

    loadTasks();
  }, []);

  return (
    <section className="recent-tasks">
      <div className="section-heading">
        <div>
          <h2>Recent Tasks</h2>
          <p>
            Latest activity across the
            workspace
          </p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-dashboard">
          No tasks created yet.
        </div>
      ) : (
        tasks.map((task) => (
          <div
            className="recent-task-row"
            key={task.id}
          >
            <span
              className={`task-status-dot ${
                task.status === "Completed"
                  ? "done"
                  : task.status ===
                    "In Progress"
                  ? "working"
                  : ""
              }`}
            />

            <div>
              <strong>
                {task.title}
              </strong>

              <p>
                {task.assigned_name ||
                  "Unassigned"}{" "}
                • {task.status}
              </p>
            </div>

            <span
              className={`priority-chip ${
                task.priority
                  ?.toLowerCase()
              }`}
            >
              {task.priority}
            </span>
          </div>
        ))
      )}
    </section>
  );
};

export default RecentTasks;