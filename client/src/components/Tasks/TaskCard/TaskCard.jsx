import "./TaskCard.css";

import {
  FaTrash,
  FaCalendarDay,
  FaUser,
} from "react-icons/fa6";

const TaskCard = ({
  task,
  onDelete,
  onStatusChange,
}) => {
  return (
    <article className="task-card">
      <div className="task-card-top">
        <span
          className={`priority-badge ${
            task.priority
              ?.toLowerCase()
          }`}
        >
          {task.priority}
        </span>

        <button
          className="task-delete-btn"
          onClick={() =>
            onDelete(task.id)
          }
        >
          <FaTrash />
        </button>
      </div>

      <h4>{task.title}</h4>

      <p className="task-description">
        {task.description ||
          "No description provided."}
      </p>

      <div className="task-meta">
        <span>
          <FaCalendarDay />
          {task.due_date ||
            "No due date"}
        </span>

        <span>
          <FaUser />
          {task.assigned_name ||
            "Unassigned"}
        </span>
      </div>

      {task.assignment_score !==
        null &&
        task.assignment_score !==
          undefined && (
          <div className="ai-assignment">
            <span>
              AI Match
            </span>

            <strong>
              {
                task.assignment_score
              }
              %
            </strong>
          </div>
        )}

      <select
        className="task-status-select"
        value={task.status}
        onChange={(e) =>
          onStatusChange(
            task.id,
            e.target.value
          )
        }
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
    </article>
  );
};

export default TaskCard;