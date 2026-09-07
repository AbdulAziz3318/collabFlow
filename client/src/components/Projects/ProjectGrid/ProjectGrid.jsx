import ProjectCard from "../ProjectCard/ProjectCard";
import "./ProjectGrid.css";

const ProjectGrid = ({
  projects,
  onDelete,
  onOpen,
}) => {
  if (!projects.length) {
    return (
      <div className="projects-empty">
        No projects found.
      </div>
    );
  }

  return (
    <div className="project-grid">
      {projects.map(
        (project) => (
          <ProjectCard
            key={
              project.id ||
              project._id
            }
            project={
              project
            }
            onDelete={
              onDelete
            }
            onOpen={
              onOpen
            }
          />
        )
      )}
    </div>
  );
};

export default ProjectGrid;