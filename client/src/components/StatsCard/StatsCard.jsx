import "./StatsCards.css";
import { useEffect, useState } from "react";

import { getDashboardStats } from "../../../services/dashboardService";

const StatsCards = () => {
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    team: 0,
    completed: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await getDashboardStats();
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const cards = [
    { title: "Projects", value: stats.projects },
    { title: "Tasks", value: stats.tasks },
    { title: "Team Members", value: stats.team },
    { title: "Completed", value: stats.completed },
  ];

  return (
    <div className="stats-container">
      {cards.map((card) => (
        <div className="stat-card" key={card.title}>
          <h3>{card.title}</h3>
          <h1>{card.value}</h1>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;