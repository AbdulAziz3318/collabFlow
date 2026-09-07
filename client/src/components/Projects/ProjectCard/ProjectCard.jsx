import "./ProjectCard.css";
import {
  FaTrash,
  FaUsers,
  FaCalendarDays,
  FaArrowRight,
} from "react-icons/fa6";

const ProjectCard = ({
  project,
  onDelete,
  onOpen,
}) => {
  const members = Array.isArray(
    project.members
  )
    ? project.members
    : [];

  const progress =
    Number(project.progress) || 0;

  const handleDelete = (
    event
  ) => {
    event.stopPropagation();

    if (
      window.confirm(
        `Delete "${project.title}"?`
      )
    ) {
      onDelete(project.id);
    }
  };

  const handleOpen = () => {
    if (onOpen) {
      onOpen(project.id);
    }
  };

  return (
    <div
      className="project-card"
      onClick={handleOpen}
    >
      <div className="project-card-top">
        <div>
          <span
            className={`project-status ${String(
              project.status || ""
            )
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            {project.status ||
              "Planning"}
          </span>

          <h3>
            {project.title ||
              "Untitled Project"}
          </h3>
        </div>

        <button
          type="button"
          className="project-delete-btn"
          onClick={
            handleDelete
          }
          title="Delete project"
        >
          <FaTrash />
        </button>
      </div>

      <p className="project-description">
        {project.description ||
          "No project description added."}
      </p>

      <div className="project-progress-section">
        <div className="project-progress-heading">
          <span>
            Progress
          </span>

          <strong>
            {progress}%
          </strong>
        </div>

        <div className="project-progress-bar">
          <div
            className="project-progress-fill"
            style={{
              width: `${Math.min(
                Math.max(
                  progress,
                  0
                ),
                100
              )}%`,
            }}
          />
        </div>
      </div>

      <div className="project-card-info">
        <div>
          <FaUsers />

          <span>
            {members.length}{" "}
            {members.length === 1
              ? "Member"
              : "Members"}
          </span>
        </div>

        <div>
          <FaCalendarDays />

          <span>
            {project.dueDate
              ? project.dueDate
              : "No due date"}
          </span>
        </div>
      </div>

      {project.manager && (
        <div className="project-manager">
          <span>
            Manager
          </span>

          <strong>
            {typeof project.manager ===
            "object"
              ? project.manager
                  .full_name ||
                project.manager
                  .email ||
                "Manager"
              : "Manager"}
          </strong>
        </div>
      )}

      {members.length > 0 && (
        <div className="project-member-preview">
          <div className="project-member-avatars">
            {members
              .slice(0, 4)
              .map(
                (
                  member,
                  index
                ) => {
                  const memberName =
                    member.full_name ||
                    member.name ||
                    "User";

                  return (
                    <div
                      className="project-member-avatar"
                      key={
                        member.id ||
                        member._id ||
                        index
                      }
                      title={
                        memberName
                      }
                    >
                      {memberName
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  );
                }
              )}

            {members.length >
              4 && (
              <div className="project-member-avatar more">
                +
                {members.length -
                  4}
              </div>
            )}
          </div>

          <span>
            Project team
          </span>
        </div>
      )}

      <button
        type="button"
        className="project-open-btn"
        onClick={(event) => {
          event.stopPropagation();

          handleOpen();
        }}
      >
        Open Project

        <FaArrowRight />
      </button>
    </div>
  );
};

export default ProjectCard;