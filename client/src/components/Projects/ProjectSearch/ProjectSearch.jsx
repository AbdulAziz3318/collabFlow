import "./ProjectSearch.css";
import { FaMagnifyingGlass } from "react-icons/fa6";

const ProjectSearch = ({
  searchTerm,
  setSearchTerm,
  filter,
  setFilter,
}) => {
  return (
    <div className="project-search">
      <div className="project-search-input">
        <FaMagnifyingGlass className="project-search-icon" />

        <input
          type="text"
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
          placeholder="Search projects..."
        />
      </div>

      <div className="project-filter">
        <span className="project-filter-label">
          Status
        </span>

        <select
          value={filter}
          onChange={(event) =>
            setFilter(event.target.value)
          }
        >
          <option value="All">All projects</option>
          <option value="Planning">Planning</option>
          <option value="In Progress">
            In Progress
          </option>
          <option value="Completed">Completed</option>
        </select>
      </div>
    </div>
  );
};

export default ProjectSearch;