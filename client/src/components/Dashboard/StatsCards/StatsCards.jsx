import { useEffect, useState } from "react";
import "./StatsCards.css";

import {
  FaFolderOpen,
  FaListCheck,
  FaUsers,
  FaCircleCheck,
} from "react-icons/fa6";

import {
  getDashboardStats,
} from "../../../services/dashboardService";

const StatsCards = () => {
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    team: 0,
    completed: 0,
  });

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response =
          await getDashboardStats();

        setStats(response.data);
      } catch (error) {
        console.error(
          "Dashboard stats error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const cards = [
    {
      title: "Projects",
      value: stats.projects,
      subtitle: "Total workspace projects",
      icon: <FaFolderOpen />,
      className: "purple",
    },
    {
      title: "Tasks",
      value: stats.tasks,
      subtitle: "Tasks across all projects",
      icon: <FaListCheck />,
      className: "blue",
    },
    {
      title: "Team Members",
      value: stats.team,
      subtitle: "Registered collaborators",
      icon: <FaUsers />,
      className: "orange",
    },
    {
      title: "Completed",
      value: stats.completed,
      subtitle: "Successfully finished tasks",
      icon: <FaCircleCheck />,
      className: "green",
    },
  ];

  return (
    <div className="stats-container">
      {cards.map((item) => (
        <div
          className="stat-card"
          key={item.title}
        >
          <div
            className={`stat-icon ${item.className}`}
          >
            {item.icon}
          </div>

          <div className="stat-content">
            <p>{item.title}</p>

            <h2>
              {loading
                ? "..."
                : item.value}
            </h2>

            <span>
              {item.subtitle}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;