import { useEffect, useState } from "react";
import "./AddTaskModal.css";

import {
  getProjects,
} from "../../../services/projectService";

const AddTaskModal = ({
  isOpen,
  onClose,
  onAddTask,
}) => {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);

  const [loadingProjects, setLoadingProjects] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "To Do",
    due_date: "",
    project_id: "",
    assigned_to: "",
    assignment_mode: "ai",
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    loadProjects();
  }, [isOpen]);

  const loadProjects = async () => {
    try {
      setLoadingProjects(true);
      setError("");

      const response =
        await getProjects();

      const projectList =
        Array.isArray(response.data)
          ? response.data
          : response.data?.projects || [];

      setProjects(projectList);
    } catch (err) {
      console.error(
        "LOAD PROJECTS ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load projects."
      );
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    if (name === "project_id") {
      const selectedProject =
        projects.find(
          (project) =>
            String(
              project.id ||
                project._id
            ) === String(value)
        );

      const projectMembers =
        Array.isArray(
          selectedProject?.members
        )
          ? selectedProject.members
          : [];

      setMembers(projectMembers);

      setTask((previous) => ({
        ...previous,
        project_id: value,
        assigned_to: "",
      }));

      return;
    }

    if (
      name === "assignment_mode"
    ) {
      setTask((previous) => ({
        ...previous,
        assignment_mode: value,
        assigned_to:
          value === "ai"
            ? ""
            : previous.assigned_to,
      }));

      return;
    }

    setTask((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setTask({
      title: "",
      description: "",
      priority: "Medium",
      status: "To Do",
      due_date: "",
      project_id: "",
      assigned_to: "",
      assignment_mode: "ai",
    });

    setMembers([]);
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!task.title.trim()) {
      setError(
        "Task title is required."
      );
      return;
    }

    if (!task.project_id) {
      setError(
        "Please select a project."
      );
      return;
    }

    if (
      task.assignment_mode ===
        "manual" &&
      !task.assigned_to
    ) {
      setError(
        "Please select a member."
      );
      return;
    }

    try {
      setSubmitting(true);

      const taskData = {
        title:
          task.title.trim(),

        description:
          task.description.trim(),

        priority:
          task.priority,

        status:
          task.status,

        due_date:
          task.due_date,

        project_id:
          task.project_id,

        assigned_to:
          task.assignment_mode ===
          "manual"
            ? task.assigned_to
            : null,

        autoAssign:
          task.assignment_mode ===
          "ai",
      };

      console.log(
        "TASK DATA SENT:",
        taskData
      );

      /*
        IMPORTANT:
        Store the value returned by the parent.
        The parent should return the API response
        from addTask().
      */

      const result =
        await onAddTask(taskData);

      console.log(
        "TASK CREATE RESULT:",
        result
      );

      resetForm();

      /*
        Do not call onClose here if your parent
        is responsible for showing the AI result
        modal and closing this modal.

        The parent should close this modal after
        it receives the recommendation.
      */
    } catch (err) {
      console.error(
        "TASK SUBMIT ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to create task."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">

      <div className="task-modal">

        <div className="task-modal-header">

          <div>
            <span className="task-modal-eyebrow">
              NEW WORK ITEM
            </span>

            <h2>
              Create Task
            </h2>

            <p>
              Add work to a project and let
              CollabFlow AI recommend the best
              member.
            </p>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={handleClose}
          >
            ×
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          {error && (
            <div className="task-error">
              {error}
            </div>
          )}

          <div className="form-group">

            <label>
              Task title
            </label>

            <input
              name="title"
              placeholder="Example: Build authentication API"
              value={task.title}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              placeholder="Describe the work, required skills and expected outcome..."
              value={task.description}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label>
              Project
            </label>

            <select
              name="project_id"
              value={task.project_id}
              onChange={handleChange}
              disabled={loadingProjects}
              required
            >

              <option value="">
                {loadingProjects
                  ? "Loading projects..."
                  : "Select project"}
              </option>

              {projects.map(
                (project) => {
                  const projectId =
                    project.id ||
                    project._id;

                  return (
                    <option
                      key={projectId}
                      value={projectId}
                    >
                      {project.name ||
                        project.title ||
                        "Untitled Project"}
                    </option>
                  );
                }
              )}

            </select>

          </div>

          <div className="form-row">

            <div className="form-group">

              <label>
                Priority
              </label>

              <select
                name="priority"
                value={task.priority}
                onChange={handleChange}
              >

                <option value="High">
                  High
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Low">
                  Low
                </option>

              </select>

            </div>

            <div className="form-group">

              <label>
                Due date
              </label>

              <input
                type="date"
                name="due_date"
                value={task.due_date}
                onChange={handleChange}
              />

            </div>

          </div>

          <div className="form-group">

            <label>
              Status
            </label>

            <select
              name="status"
              value={task.status}
              onChange={handleChange}
            >

              <option value="To Do">
                To Do
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Completed">
                Completed
              </option>

            </select>

          </div>

          <div className="assignment-section">

            <div className="assignment-section-header">

              <div>

                <h3>
                  Task Assignment
                </h3>

                <p>
                  Let CollabFlow AI choose the
                  most suitable member or assign
                  the task manually.
                </p>

              </div>

              <span className="ai-badge">
                AI
              </span>

            </div>

            <div className="assignment-mode-grid">

              <label
                className={
                  `assignment-option ${
                    task.assignment_mode ===
                    "ai"
                      ? "active"
                      : ""
                  }`
                }
              >

                <input
                  type="radio"
                  name="assignment_mode"
                  value="ai"
                  checked={
                    task.assignment_mode ===
                    "ai"
                  }
                  onChange={handleChange}
                />

                <div>

                  <strong>
                    CollabFlow AI
                  </strong>

                  <span>
                    Automatically choose the
                    best available project
                    member.
                  </span>

                </div>

              </label>

              <label
                className={
                  `assignment-option ${
                    task.assignment_mode ===
                    "manual"
                      ? "active"
                      : ""
                  }`
                }
              >

                <input
                  type="radio"
                  name="assignment_mode"
                  value="manual"
                  checked={
                    task.assignment_mode ===
                    "manual"
                  }
                  onChange={handleChange}
                />

                <div>

                  <strong>
                    Manual Assignment
                  </strong>

                  <span>
                    Choose the member
                    yourself.
                  </span>

                </div>

              </label>

            </div>

            {task.assignment_mode ===
              "ai" && (

              <div className="form-group">

                <label>
                  Assign member
                </label>

                <select
                  className="ai-select"
                  value=""
                  disabled
                >

                  <option value="">
                    Let CollabFlow AI choose
                  </option>

                </select>

                <small className="field-help">
                  CollabFlow AI will compare
                  the task requirements with
                  project members' skills,
                  specialization, experience
                  and workload.
                </small>

              </div>
            )}

            {task.assignment_mode ===
              "manual" && (

              <div className="form-group">

                <label>
                  Select member
                </label>

                <select
                  name="assigned_to"
                  value={task.assigned_to}
                  onChange={handleChange}
                  disabled={!task.project_id}
                >

                  <option value="">

                    {!task.project_id
                      ? "Select a project first"
                      : members.length === 0
                      ? "No members available"
                      : "Select member"}

                  </option>

                  {members.map(
                    (member) => {

                      const memberId =
                        member.user_id ||
                        member.id ||
                        member._id;

                      const memberName =
                        member.name ||
                        member.full_name ||
                        member.username ||
                        member.email ||
                        "Team Member";

                      return (
                        <option
                          key={memberId}
                          value={memberId}
                        >
                          {memberName}
                        </option>
                      );
                    }
                  )}

                </select>

                <small className="field-help">
                  Only members belonging to
                  the selected project are
                  shown.
                </small>

              </div>
            )}

          </div>

          <div className="buttons">

            <button
              type="button"
              className="cancel-btn"
              onClick={handleClose}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="create-task-btn"
              disabled={
                submitting ||
                loadingProjects
              }
            >

              {submitting
                ? "Creating..."
                : task.assignment_mode ===
                  "ai"
                ? "Create & AI Assign"
                : "Create Task"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddTaskModal;