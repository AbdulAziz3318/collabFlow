import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import "./ProjectDetails.css";

import {
  getProject,
  addProjectMember,
  removeProjectMember,
} from "../../services/projectService";

import AddMemberModal from "../../components/Team/AddMemberModal/AddMemberModal";

const ProjectDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [project, setProject] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showMemberModal, setShowMemberModal] =
    useState(false);

  const [memberActionLoading, setMemberActionLoading] =
    useState(false);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getProject(id);

      const data =
        response.data?.project ||
        response.data;

      setProject(data);
    } catch (error) {
      console.error(
        "Load project error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load project"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id]);

const handleAddMember = async (user) => {
  try {
    const userId =
      user.id || user._id;

    await addProjectMember(
      id,
      userId
    );

    await loadProject();

    setShowMemberModal(false);
  } catch (error) {
    console.error(
      "Add member error:",
      error
    );

    alert(
      error.response?.data?.message ||
        "Failed to add member"
    );
  }
};

  const handleRemoveMember = async (
    userId
  ) => {
    const confirmed =
      window.confirm(
        "Remove this member from the project?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await removeProjectMember(
        id,
        userId
      );

      await loadProject();
    } catch (error) {
      console.error(
        "Remove member error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to remove member"
      );
    }
  };

  if (loading) {
    return (
      <div className="project-details-page">
        <div className="project-details-state">
          Loading project...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-details-page">
        <div className="project-details-state error">
          {error}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-details-page">
        <div className="project-details-state">
          Project not found.
        </div>
      </div>
    );
  }

  const members =
    Array.isArray(
      project.members
    )
      ? project.members
      : [];

  const tasks =
    Array.isArray(
      project.tasks
    )
      ? project.tasks
      : [];

  const manager =
    project.manager;

  const progress =
    Number(
      project.progress
    ) || 0;

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "Completed"
    ).length;

  return (
    <div className="project-details-page">
      <div className="project-details-topbar">
        <button
          type="button"
          className="project-back-btn"
          onClick={() =>
            navigate(
              "/projects"
            )
          }
        >
          ← Back
        </button>
      </div>

      <div className="project-details-hero">
        <div className="project-details-main">
          <span className="project-details-label">
            PROJECT
          </span>

          <h1>
            {project.title}
          </h1>

          <p>
            {project.description ||
              "No project description provided."}
          </p>

          <div className="project-meta-row">
            <span>
              {project.status ||
                "Planning"}
            </span>

            {project.dueDate && (
              <span>
                Due{" "}
                {
                  project.dueDate
                }
              </span>
            )}

            <span>
              {
                members.length
              }{" "}
              member
              {members.length !==
              1
                ? "s"
                : ""}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="project-add-work-btn"
          onClick={() =>
            navigate(
              `/tasks?project=${project.id || project._id}`
            )
          }
        >
          + Add Work
        </button>
      </div>

      <div className="project-progress-card">
        <div className="project-progress-header">
          <div>
            <span>
              Project Progress
            </span>

            <strong>
              {progress}%
            </strong>
          </div>

          <small>
            {completedTasks} of{" "}
            {tasks.length} tasks
            completed
          </small>
        </div>

        <div className="project-progress-track">
          <div
            className="project-progress-fill"
            style={{
              width: `${Math.min(
                progress,
                100
              )}%`,
            }}
          />
        </div>
      </div>

      <div className="project-details-grid">
        <section className="project-panel">
          <div className="project-panel-header">
            <div>
              <span>
                TEAM
              </span>

              <h2>
                Project Members
              </h2>

              <p>
                Members currently
                assigned to this
                project.
              </p>
            </div>

            <button
  type="button"
  className="project-member-add-btn"
  onClick={() =>
    setShowMemberModal(true)
  }
>
  + Add Member
</button>
          </div>

          {manager && (
            <div className="project-manager-card">
              <div className="project-member-avatar manager">
                {(
                  manager.full_name ||
                  manager.name ||
                  "M"
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <strong>
                  {manager.full_name ||
                    manager.name ||
                    "Manager"}
                </strong>

                <span>
                  Project Manager
                </span>
              </div>
            </div>
          )}

          <div className="project-members-list">
            {members.length ===
            0 ? (
              <div className="project-empty">
                No project members
                added yet.
              </div>
            ) : (
              members.map(
                (member) => {
                  const memberId =
                    member.id ||
                    member._id;

                  const skills =
                    Array.isArray(
                      member.skills
                    )
                      ? member.skills
                      : [];

                  return (
                    <div
                      className="project-member-row"
                      key={
                        memberId
                      }
                    >
                      <div className="project-member-avatar">
                        {(
                          member.full_name ||
                          member.name ||
                          "U"
                        )
                          .charAt(
                            0
                          )
                          .toUpperCase()}
                      </div>

                      <div className="project-member-info">
                        <strong>
                          {member.full_name ||
                            member.name}
                        </strong>

                        <span>
                          {member.specialization ||
                            member.role ||
                            "Member"}
                        </span>

                        <div className="project-member-skills">
                          {skills
                            .slice(
                              0,
                              3
                            )
                            .map(
                              (
                                skill
                              ) => (
                                <small
                                  key={
                                    skill
                                  }
                                >
                                  {
                                    skill
                                  }
                                </small>
                              )
                            )}

                          {skills.length >
                            3 && (
                            <small>
                              +
                              {skills.length -
                                3}
                            </small>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="project-member-remove"
                        onClick={() =>
                          handleRemoveMember(
                            memberId
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>
                  );
                }
              )
            )}
          </div>
        </section>

        <section className="project-panel">
          <div className="project-panel-header">
            <div>
              <span>
                WORK
              </span>

              <h2>
                Project Tasks
              </h2>

              <p>
                Current work and
                assignment status.
              </p>
            </div>

            <button
              type="button"
              className="project-member-add-btn"
              onClick={() =>
                navigate(
                  `/tasks?project=${project.id || project._id}`
                )
              }
            >
              + Add Task
            </button>
          </div>

          <div className="project-task-list">
            {tasks.length ===
            0 ? (
              <div className="project-empty">
                No tasks created for
                this project yet.
              </div>
            ) : (
              tasks
                .slice(0, 6)
                .map(
                  (task) => (
                    <div
                      className="project-task-row"
                      key={
                        task.id ||
                        task._id
                      }
                    >
                      <div>
                        <strong>
                          {
                            task.title
                          }
                        </strong>

                        <span>
                          {task.assigned_name ||
                            task.assigned_to
                              ?.full_name ||
                            "Unassigned"}
                        </span>
                      </div>

                      <small
                        className={`task-status-badge ${
                          task.status
                            ?.toLowerCase()
                            .replace(
                              /\s+/g,
                              "-"
                            ) ||
                          ""
                        }`}
                      >
                        {
                          task.status
                        }
                      </small>
                    </div>
                  )
                )
            )}
          </div>
        </section>
      </div>

      <AddMemberModal
  isOpen={showMemberModal}
  onClose={() =>
    setShowMemberModal(false)
  }
  onSelectMember={handleAddMember}
  existingMembers={
    project.members || []
  }
/>
    </div>
  );
};

export default ProjectDetails;