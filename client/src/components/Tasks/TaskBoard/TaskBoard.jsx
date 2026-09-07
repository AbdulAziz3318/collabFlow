import "./TaskBoard.css";

import TaskColumn from "../TaskColumn/TaskColumn";

const TaskBoard = ({
  tasks = [],
  onDelete,
  onStatusChange,
}) => {
  const todo = tasks.filter(
    (task) =>
      task.status === "To Do"
  );

  const progress =
    tasks.filter(
      (task) =>
        task.status ===
        "In Progress"
    );

  const completed =
    tasks.filter(
      (task) =>
        task.status ===
        "Completed"
    );

  return (
    <div className="task-board">
      <TaskColumn
        title="To Do"
        count={todo.length}
        tasks={todo}
        onDelete={onDelete}
        onStatusChange={
          onStatusChange
        }
      />

      <TaskColumn
        title="In Progress"
        count={progress.length}
        tasks={progress}
        onDelete={onDelete}
        onStatusChange={
          onStatusChange
        }
      />

      <TaskColumn
        title="Completed"
        count={completed.length}
        tasks={completed}
        onDelete={onDelete}
        onStatusChange={
          onStatusChange
        }
      />
    </div>
  );
};

export default TaskBoard;