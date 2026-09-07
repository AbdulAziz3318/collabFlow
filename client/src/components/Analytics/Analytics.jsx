import "./Analytics.css";
import ProjectChart from "../ProjectChart/ProjectChart";

const Analytics = () => {
  return (
    <div className="analytics">

      <div className="chart-section">
        <ProjectChart />
      </div>

      <div className="calendar-section">
        <h2>Upcoming Deadlines</h2>

        <div className="deadline-card">
          <h3>Dashboard UI</h3>
          <p>8 July 2026</p>
        </div>

        <div className="deadline-card">
          <h3>Backend API</h3>
          <p>12 July 2026</p>
        </div>

        <div className="deadline-card">
          <h3>Socket Chat</h3>
          <p>18 July 2026</p>
        </div>

      </div>

    </div>
  );
};

export default Analytics;