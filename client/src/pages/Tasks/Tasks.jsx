import {
  useEffect,
  useState,
} from "react";

import "./Tasks.css";

import TaskBoard from "../../components/Tasks/TaskBoard/TaskBoard";
import AddTaskModal from "../../components/Tasks/AddTaskModal/AddTaskModal";

import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} from "../../services/taskService";


const Tasks = () => {
  const [tasks, setTasks] =
    useState([]);

  const [isOpen, setIsOpen] =
    useState(false);

  const [aiResult, setAiResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [updatingTaskId, setUpdatingTaskId] =
    useState(null);


  // ====================================================
  // LOAD TASKS
  // ====================================================

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getTasks();

      console.log(
        "TASKS RESPONSE:",
        response.data
      );

      const taskList =
        Array.isArray(
          response.data
        )
          ? response.data
          : response.data?.tasks ||
            [];

      setTasks(taskList);

    } catch (err) {
      console.error(
        "LOAD TASKS ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load tasks."
      );

    } finally {
      setLoading(false);
    }
  };


  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    loadTasks();
  }, []);


  // ====================================================
  // ADD TASK
  // ====================================================

  const handleAddTask = async (
    taskData
  ) => {
    try {
      setError("");

      console.log(
        "SENDING TASK:",
        taskData
      );

      const response =
        await addTask(
          taskData
        );

      console.log(
        "TASK CREATE RESPONSE:",
        response.data
      );

      if (
        response.data
          ?.aiAssignment
      ) {
        setAiResult(
          response.data
            .aiAssignment
        );
      }

      setIsOpen(false);

      await loadTasks();

    } catch (error) {
      console.error(
        "CREATE TASK ERROR:",
        error
      );

      alert(
        error.response?.data
          ?.message ||
          "Unable to create task"
      );
    }
  };


  // ====================================================
  // CHANGE TASK STATUS
  // ====================================================

  const handleStatusChange =
    async (
      taskId,
      newStatus
    ) => {
      try {
        setError("");
        setUpdatingTaskId(
          taskId
        );

        console.log(
          "================================"
        );

        console.log(
          "UPDATING TASK STATUS"
        );

        console.log(
          "Task ID:",
          taskId
        );

        console.log(
          "New status:",
          newStatus
        );

        console.log(
          "================================"
        );


        // ----------------------------------------------
        // IMMEDIATELY UPDATE UI
        // ----------------------------------------------

        setTasks(
          (
            previousTasks
          ) =>
            previousTasks.map(
              (task) => {
                const currentId =
                  task.id ||
                  task._id;

                if (
                  String(
                    currentId
                  ) ===
                  String(
                    taskId
                  )
                ) {
                  return {
                    ...task,
                    status:
                      newStatus,
                  };
                }

                return task;
              }
            )
        );


        // ----------------------------------------------
        // UPDATE DATABASE
        // ----------------------------------------------

        const response =
          await updateTask(
            taskId,
            {
              status:
                newStatus,
            }
          );


        console.log(
          "STATUS UPDATE RESPONSE:",
          response.data
        );


        // ----------------------------------------------
        // HANDLE BOTH RESPONSE FORMATS
        // ----------------------------------------------

        const updatedTask =
          response.data?.task ||
          response.data;


        if (updatedTask) {
          setTasks(
            (
              previousTasks
            ) =>
              previousTasks.map(
                (task) => {
                  const currentId =
                    task.id ||
                    task._id;

                  const responseId =
                    updatedTask.id ||
                    updatedTask._id ||
                    taskId;

                  if (
                    String(
                      currentId
                    ) ===
                    String(
                      responseId
                    )
                  ) {
                    return {
                      ...task,
                      ...updatedTask,

                      status:
                        updatedTask
                          .status ||
                        newStatus,
                    };
                  }

                  return task;
                }
              )
          );
        }


        // ----------------------------------------------
        // FETCH LATEST DATA FROM DATABASE
        // ----------------------------------------------

        await loadTasks();

      } catch (error) {
        console.error(
          "STATUS UPDATE ERROR:",
          error
        );

        console.error(
          "SERVER ERROR:",
          error.response?.data
        );

        setError(
          error.response?.data
            ?.message ||
            "Unable to update task status."
        );


        // Reload because optimistic
        // UI update may need rollback
        await loadTasks();

      } finally {
        setUpdatingTaskId(
          null
        );
      }
    };


  // ====================================================
  // DELETE TASK
  // ====================================================

  const handleDeleteTask =
    async (id) => {
      try {
        setError("");

        await deleteTask(
          id
        );

        await loadTasks();

      } catch (err) {
        console.error(
          "DELETE TASK ERROR:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
            "Unable to delete task."
        );
      }
    };


  // ====================================================
  // AI RESULT - MEMBER
  // ====================================================

  const getMemberName = () => {
    return (
      aiResult?.user
        ?.full_name ||
      aiResult?.user
        ?.name ||
      aiResult?.member
        ?.full_name ||
      aiResult?.member
        ?.name ||
      aiResult?.member_name ||
      "Assigned Member"
    );
  };


  // ====================================================
  // AI RESULT - SPECIALIZATION
  // ====================================================

  const getSpecialization =
    () => {
      return (
        aiResult?.user
          ?.specialization ||
        aiResult?.member
          ?.specialization ||
        aiResult
          ?.specialization ||
        "Team Member"
      );
    };


  // ====================================================
  // AI RESULT - EXPERIENCE
  // ====================================================

  const getExperience = () => {
    return (
      aiResult?.user
        ?.experience_years ??
      aiResult?.member
        ?.experience_years ??
      aiResult
        ?.experience_years ??
      0
    );
  };


  // ====================================================
  // AI RESULT - ACTIVE TASKS
  // ====================================================

  const getActiveTasks = () => {
    return (
      aiResult
        ?.activeTasks ??
      aiResult?.user
        ?.active_tasks ??
      aiResult?.member
        ?.active_tasks ??
      aiResult
        ?.active_tasks ??
      0
    );
  };


  // ====================================================
  // AI RESULT - SCORE
  // ====================================================

  const getScore = () => {
    const score =
      aiResult?.score ??
      aiResult?.matchScore ??
      0;

    return Math.round(
      Number(score) || 0
    );
  };


  // ====================================================
  // AI RESULT - MATCHED SKILLS
  // ====================================================

  const getMatchedSkills =
    () => {
      if (
        Array.isArray(
          aiResult
            ?.matchedSkills
        )
      ) {
        return aiResult
          .matchedSkills;
      }

      if (
        Array.isArray(
          aiResult
            ?.matched_skills
        )
      ) {
        return aiResult
          .matched_skills;
      }

      /*
        If backend currently
        doesn't return matchedSkills,
        show selected user's skills.
      */

      if (
        Array.isArray(
          aiResult?.user
            ?.skills
        )
      ) {
        return aiResult
          .user
          .skills;
      }

      if (
        Array.isArray(
          aiResult?.member
            ?.skills
        )
      ) {
        return aiResult
          .member
          .skills;
      }

      return [];
    };


  const memberName =
    getMemberName();

  const matchedSkills =
    getMatchedSkills();


  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="tasks-page">

      {/* ============================================= */}
      {/* HEADER */}
      {/* ============================================= */}

      <div className="tasks-header">

        <div>
          <span className="tasks-eyebrow">
            WORKSPACE
          </span>

          <h1>
            Task Management
          </h1>

          <p>
            Create, assign and monitor
            project work using
            intelligent recommendations.
          </p>
        </div>


        <button
          className="add-task-btn"
          onClick={() =>
            setIsOpen(true)
          }
        >
          + New Task
        </button>

      </div>


      {/* ============================================= */}
      {/* ERROR */}
      {/* ============================================= */}

      {error && (
        <div className="tasks-error">
          {error}
        </div>
      )}


      {/* ============================================= */}
      {/* AI RESULT */}
      {/* ============================================= */}

      {aiResult && (
        <div className="ai-recommendation-card">

          <div className="ai-recommendation-header">

            <div>
              <span>
                AI RECOMMENDATION
              </span>

              <h2>
                Intelligent Task
                Assignment
              </h2>

              <p>
                CollabFlow AI analyzed
                the project members and
                selected the most
                suitable member based
                on skills, experience,
                specialization and
                workload.
              </p>
            </div>


            <div className="ai-score">
              {getScore()}%
            </div>

          </div>


          <div className="ai-recommendation-body">

            {/* RECOMMENDED USER */}

            <div className="recommended-user">

              <div className="recommended-avatar">
                {memberName
                  .charAt(0)
                  .toUpperCase()}
              </div>


              <div>
                <span>
                  RECOMMENDED MEMBER
                </span>

                <h3>
                  {memberName}
                </h3>

                <p>
                  {getSpecialization()}
                </p>
              </div>

            </div>


            {/* RESULT GRID */}

            <div className="ai-result-grid">

              <div className="ai-result-item">
                <span>
                  Match Score
                </span>

                <strong>
                  {getScore()}%
                </strong>
              </div>


              <div className="ai-result-item">
                <span>
                  Experience
                </span>

                <strong>
                  {getExperience()} Years
                </strong>
              </div>


              <div className="ai-result-item">
                <span>
                  Active Tasks
                </span>

                <strong>
                  {getActiveTasks()}
                </strong>
              </div>

            </div>


            {/* MATCHED SKILLS */}

            <div className="ai-match-section">

              <span>
                MATCHED SKILLS
              </span>


              <div className="ai-skills">

                {matchedSkills.length >
                0 ? (
                  matchedSkills.map(
                    (
                      skill,
                      index
                    ) => (
                      <span
                        key={`${skill}-${index}`}
                      >
                        {skill}
                      </span>
                    )
                  )
                ) : (
                  <span>
                    General skill match
                  </span>
                )}

              </div>

            </div>


            {/* REASON */}

            <div className="ai-reason">

              <span>
                WHY THIS MEMBER?
              </span>


              <p>
                {aiResult.reason ||
                  "Selected because this member has the strongest combination of relevant skills, specialization, experience and available workload."}
              </p>

            </div>

          </div>


          <div className="ai-result-footer">

            <span>
              ✓ Task automatically
              assigned
            </span>


            <button
              type="button"
              onClick={() =>
                setAiResult(null)
              }
            >
              Close
            </button>

          </div>

        </div>
      )}


      {/* ============================================= */}
      {/* TASK BOARD */}
      {/* ============================================= */}

      {loading &&
      tasks.length === 0 ? (

        <div className="tasks-loading">
          Loading tasks...
        </div>

      ) : (

        <TaskBoard
          tasks={tasks}

          onDelete={
            handleDeleteTask
          }

          onStatusChange={
            handleStatusChange
          }

          updatingTaskId={
            updatingTaskId
          }
        />

      )}


      {/* ============================================= */}
      {/* ADD TASK MODAL */}
      {/* ============================================= */}

      <AddTaskModal
        isOpen={isOpen}

        onClose={() =>
          setIsOpen(false)
        }

        onAddTask={
          handleAddTask
        }
      />

    </div>
  );
};


export default Tasks;