import "./MemberCard.css";

import {
  FaBriefcase,
  FaEnvelope,
  FaLayerGroup,
} from "react-icons/fa6";

const MemberCard = ({
  member,
}) => {
  const name =
    member.full_name ||
    member.name ||
    "Team Member";

  const specialization =
    member.specialization ||
    "General";

  const skills =
  Array.isArray(member.skills)
    ? member.skills
    : typeof member.skills ===
        "string"
      ? member.skills
          .split(",")
          .map((skill) =>
            skill.trim()
          )
          .filter(Boolean)
      : [];

  const activeTasks =
    Number(
      member.active_tasks
    ) || 0;

  const status =
    member.status ||
    (activeTasks >= 3
      ? "Busy"
      : "Available");

  return (
    <div className="member-card">
      <div className="member-card-top">
        <div className="member-avatar">
          {name
            .charAt(0)
            .toUpperCase()}
        </div>

        <div className="member-main-info">
          <h3>{name}</h3>

          <span>
            {specialization}
          </span>
        </div>

        <div
          className={`member-status ${status.toLowerCase()}`}
        >
          {status}
        </div>
      </div>

      <div className="member-email">
        <FaEnvelope />
        <span>
          {member.email}
        </span>
      </div>

      <div className="member-skills-section">
        <div className="member-section-title">
          Skills
        </div>

        <div className="member-skills">
          {skills.length > 0 ? (
            <>
              {skills
                .slice(0, 4)
                .map(
                  (skill) => (
                    <span
                      key={skill}
                    >
                      {skill}
                    </span>
                  )
                )}

              {skills.length >
                4 && (
                <span className="skill-more">
                  +
                  {skills.length -
                    4}
                </span>
              )}
            </>
          ) : (
            <span className="no-skills">
              No skills added
            </span>
          )}
        </div>
      </div>

      <div className="member-details">
        <div>
          <FaBriefcase />

          <span>
            Experience
          </span>

          <strong>
            {member.experience_years ||
              0}{" "}
            yrs
          </strong>
        </div>

        <div>
          <FaLayerGroup />

          <span>
            Active Tasks
          </span>

          <strong>
            {activeTasks}
          </strong>
        </div>
      </div>

      <button
        type="button"
        className="member-profile-btn"
      >
        View Profile
      </button>
    </div>
  );
};

export default MemberCard;