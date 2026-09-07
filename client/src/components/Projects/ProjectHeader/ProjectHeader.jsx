import "./ProjectHeader.css";
import { FaPlus } from "react-icons/fa6";

const ProjectHeader = ({ onAdd }) => {
  return (
    <div className="project-header">
      <div className="project-header-content">
        <div className="project-header-eyebrow">
          Workspace
        </div>

        <h1>Projects</h1>

        <p>
          Organize teams, assign work and track project progress.
        </p>
      </div>

      <button
        type="button"
        className="add-project-btn"
        onClick={onAdd}
      >
        <FaPlus />
        Create Project
      </button>
    </div>
  );
};

export default ProjectHeader;