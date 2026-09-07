import {
  useEffect,
  useState,
} from "react";

import "./AddProjectModal.css";

import {
  getTeam,
} from "../../../services/teamService";

const AddProjectModal = ({
  isOpen,
  onClose,
  onAddProject,
}) => {
  const [team, setTeam] =
    useState([]);

  const [loadingTeam, setLoadingTeam] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [form, setForm] =
    useState({
      title: "",
      description: "",
      status: "Planning",
      dueDate: "",
      manager: "",
      members: [],
    });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const loadTeam = async () => {
      try {
        setLoadingTeam(true);

        const response =
          await getTeam();

        setTeam(
          Array.isArray(response.data)
            ? response.data
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load team:",
          error
        );

        setTeam([]);
      } finally {
        setLoadingTeam(false);
      }
    };

    loadTeam();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setForm({
        title: "",
        description: "",
        status: "Planning",
        dueDate: "",
        manager: "",
        members: [],
      });
    }
  }, [isOpen]);

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleMember = (
    memberId
  ) => {
    setForm((prev) => {
      const exists =
        prev.members.includes(
          memberId
        );

      return {
        ...prev,

        members: exists
          ? prev.members.filter(
              (id) =>
                id !== memberId
            )
          : [
              ...prev.members,
              memberId,
            ],
      };
    });
  };

  const handleManagerChange = (
    event
  ) => {
    const managerId =
      event.target.value;

    setForm((prev) => {
      let updatedMembers =
        prev.members;

      if (
        managerId &&
        !updatedMembers.includes(
          managerId
        )
      ) {
        updatedMembers = [
          ...updatedMembers,
          managerId,
        ];
      }

      return {
        ...prev,
        manager: managerId,
        members:
          updatedMembers,
      };
    });
  };

  const handleSubmit =
    async () => {
      if (!form.title.trim()) {
        alert(
          "Project title is required"
        );
        return;
      }

      if (!form.manager) {
        alert(
          "Please select a project manager"
        );
        return;
      }

      if (
        form.members.length === 0
      ) {
        alert(
          "Please select at least one team member"
        );
        return;
      }

      try {
        setSubmitting(true);

        await onAddProject({
          ...form,
          title:
            form.title.trim(),
          description:
            form.description.trim(),
        });
      } catch (error) {
        console.error(
          "Project creation failed:",
          error
        );
      } finally {
        setSubmitting(false);
      }
    };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="project-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="project-modal-header">
          <div>
            <span>
              NEW PROJECT
            </span>

            <h2>
              Create Project
            </h2>

            <p>
              Create a collaborative
              workspace, select the
              manager and choose the
              members who will work on
              this project.
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="project-form-grid">
          <div className="project-field full">
            <label>
              Project name
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={
                handleChange
              }
              placeholder="Example: CollabFlow AI"
              autoComplete="off"
            />
          </div>

          <div className="project-field full">
            <label>
              Description
            </label>

            <textarea
              name="description"
              value={
                form.description
              }
              onChange={
                handleChange
              }
              rows="4"
              placeholder="Explain the project objective and the work involved..."
            />
          </div>

          <div className="project-field">
            <label>
              Due date
            </label>

            <input
              type="date"
              name="dueDate"
              value={
                form.dueDate
              }
              onChange={
                handleChange
              }
            />
          </div>

          <div className="project-field">
            <label>
              Project status
            </label>

            <select
              name="status"
              value={
                form.status
              }
              onChange={
                handleChange
              }
            >
              <option value="Planning">
                Planning
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Completed">
                Completed
              </option>
            </select>
          </div>

          <div className="project-field full">
            <label>
              Project Manager
            </label>

            <select
              name="manager"
              value={
                form.manager
              }
              onChange={
                handleManagerChange
              }
              disabled={
                loadingTeam
              }
            >
              <option value="">
                {loadingTeam
                  ? "Loading team..."
                  : "Select manager"}
              </option>

              {team.map(
                (member) => (
                  <option
                    key={
                      member.id
                    }
                    value={
                      member.id
                    }
                  >
                    {member.full_name ||
                      member.name}{" "}
                    —{" "}
                    {member.role ||
                      "Member"}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="project-field full">
            <div className="member-selection-heading">
              <div>
                <label>
                  Team Members
                </label>

                <p>
                  These members can
                  receive tasks and AI
                  recommendations inside
                  this project.
                </p>
              </div>

              <strong>
                {
                  form.members
                    .length
                }{" "}
                selected
              </strong>
            </div>

            {loadingTeam ? (
              <div className="project-team-message">
                Loading team
                members...
              </div>
            ) : team.length ===
              0 ? (
              <div className="project-team-message">
                No team members
                available. Register
                users first from your
                application.
              </div>
            ) : (
              <div className="project-member-grid">
                {team.map(
                  (member) => {
                    const memberId =
                      member.id;

                    const selected =
                      form.members.includes(
                        memberId
                      );

                    const isManager =
                      form.manager ===
                      memberId;

                    const displayName =
                      member.full_name ||
                      member.name ||
                      "User";

                    return (
                      <button
                        type="button"
                        key={
                          memberId
                        }
                        className={`member-select-card ${
                          selected
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          toggleMember(
                            memberId
                          )
                        }
                      >
                        <div className="member-avatar">
                          {displayName
                            .charAt(
                              0
                            )
                            .toUpperCase()}
                        </div>

                        <div className="member-select-info">
                          <strong>
                            {
                              displayName
                            }
                          </strong>

                          <span>
                            {member.specialization ||
                              member.role ||
                              "Team Member"}
                          </span>

                          {isManager && (
                            <small>
                              Project
                              Manager
                            </small>
                          )}
                        </div>

                        <div className="member-check">
                          {selected
                            ? "✓"
                            : "+"}
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </div>

        <div className="project-modal-actions">
          <button
            type="button"
            className="cancel-project-btn"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="create-project-btn"
            onClick={
              handleSubmit
            }
            disabled={
              submitting ||
              loadingTeam
            }
          >
            {submitting
              ? "Creating..."
              : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProjectModal;