import "./TaskColumn.css";

import TaskCard from "../TaskCard/TaskCard";

const TaskColumn = ({
  title,
  count,
  tasks,
  onDelete,
  onStatusChange,
}) => {
  return (
    <div className="task-column">
      <div className="task-column-header">
        <h3>{title}</h3>

        <span>{count}</span>
      </div>

      <div className="task-column-content">
        {tasks.length === 0 ? (
          <div className="task-empty">
            No tasks here
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={
                onDelete
              }
              onStatusChange={
                onStatusChange
              }
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskColumn;