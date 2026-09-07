import {
  useEffect,
  useState,
} from "react";

import "./RecentProjects.css";

import {
  getRecentProjects,
} from "../../../services/dashboardService";

const RecentProjects = () => {
  const [projects, setProjects] =
    useState([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response =
          await getRecentProjects();

        setProjects(
          response.data.slice(0, 4)
        );
      } catch (error) {
        console.error(error);
      }
    };

    loadProjects();
  }, []);

  return (
    <section className="recent-projects">
      <div className="section-heading">
        <div>
          <h2>Recent Projects</h2>
          <p>
            Latest projects in your
            workspace
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="empty-dashboard">
          No projects created yet.
        </div>
      ) : (
        projects.map((project) => (
          <div
            className="recent-project-row"
            key={project.id}
          >
            <div>
              <strong>
                {project.title}
              </strong>

              <span>
                {project.status}
              </span>
            </div>

            <div className="recent-progress">
              <div>
                <span
                  style={{
                    width: `${
                      project.progress || 0
                    }%`,
                  }}
                />
              </div>

              <small>
                {project.progress || 0}%
              </small>
            </div>
          </div>
        ))
      )}
    </section>
  );
};

export default RecentProjects;