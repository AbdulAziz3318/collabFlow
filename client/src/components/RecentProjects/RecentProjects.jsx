import "./RecentProjects.css";
import { useEffect, useState } from "react";
import { getRecentProjects } from "../../../services/dashboardService";

const RecentProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await getRecentProjects();
      setProjects(res.data.slice(0, 5));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="recent-projects">
      <h2>Recent Projects</h2>

      {projects.map((project) => (
        <div className="project-item" key={project.id}>
          <span>{project.title}</span>
          <span>{project.progress}%</span>
        </div>
      ))}
    </div>
  );
};

export default RecentProjects;