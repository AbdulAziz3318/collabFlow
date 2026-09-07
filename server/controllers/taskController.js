const TaskModel = require("../models/taskModel");
const Project = require("../models/projectModel");

const {
  scoreCandidate,
} = require("../services/intelligenceService");


// ======================================================
// HELPER - LOGGED IN USER
// ======================================================

const getLoggedInUserInfo = (req) => {
  const userId =
    req.user?.id ||
    req.user?._id;

  const role = String(
    req.user?.role || ""
  )
    .trim()
    .toLowerCase();

  return {
    userId,
    role,
  };
};


// ======================================================
// HELPER - MANAGER CHECK
// ======================================================

const isManagerRole = (role) => {
  return (
    role === "manager" ||
    role === "admin" ||
    role === "project manager" ||
    role === "project_manager"
  );
};


// ======================================================
// HELPER - FORMAT TASK
// ======================================================

const formatTask = (task) => {
  if (!task) {
    return null;
  }

  const data = task.toObject
    ? task.toObject()
    : { ...task };

  data.id =
    task._id?.toString?.() ||
    data.id;

  // Assigned user
  if (task.assigned_to) {
    const assignedUser =
      task.assigned_to;

    // populated user object
    if (
      typeof assignedUser === "object" &&
      assignedUser._id
    ) {
      data.assigned_name =
        assignedUser.full_name ||
        assignedUser.name ||
        assignedUser.email ||
        "Team Member";

      data.assigned_user = {
        id:
          assignedUser._id.toString(),

        full_name:
          assignedUser.full_name ||
          assignedUser.name ||
          "",

        email:
          assignedUser.email ||
          "",

        role:
          assignedUser.role ||
          "",

        skills:
          assignedUser.skills ||
          [],

        specialization:
          assignedUser.specialization ||
          "",

        experience_years:
          assignedUser.experience_years ||
          0,
      };

      data.assigned_to =
        assignedUser._id.toString();
    } else {
      data.assigned_to =
        String(assignedUser);
    }
  } else {
    data.assigned_to = null;
    data.assigned_name =
      "Unassigned";
    data.assigned_user =
      null;
  }

  // Project
  if (task.project_id) {
    const project =
      task.project_id;

    if (
      typeof project === "object" &&
      project._id
    ) {
      data.project_name =
        project.title ||
        project.name ||
        "Project";

      data.project_id =
        project._id.toString();
    } else {
      data.project_id =
        String(project);
    }
  }

  delete data._id;
  delete data.__v;

  return data;
};


// ======================================================
// GET TASKS
// ======================================================

const fetchTasks = async (
  req,
  res
) => {
  try {
    const {
      userId,
      role,
    } =
      getLoggedInUserInfo(req);

    if (!userId) {
      return res
        .status(401)
        .json({
          message:
            "Unable to identify logged-in user",
        });
    }

    const filter = {};

    const manager =
      isManagerRole(role);

    // Members only see their tasks
    if (!manager) {
      filter.assigned_to =
        userId;
    }

    // Optional project filter
    if (req.query.project) {
      filter.project_id =
        req.query.project;
    }

    console.log(
      "================================"
    );

    console.log(
      "Fetching tasks"
    );

    console.log(
      "Logged user:",
      userId
    );

    console.log(
      "Role:",
      role
    );

    console.log(
      "Manager:",
      manager
    );

    console.log(
      "Filter:",
      filter
    );

    console.log(
      "================================"
    );

    const tasks =
      await TaskModel.find(
        filter
      )
        .populate(
          "assigned_to",
          "full_name name email role skills specialization experience_years"
        )
        .populate(
          "project_id",
          "title name status"
        )
        .sort({
          createdAt: -1,
        });

    const formattedTasks =
      tasks.map(
        formatTask
      );

    return res
      .status(200)
      .json(
        formattedTasks
      );
  } catch (error) {
    console.error(
      "Fetch tasks error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          error.message ||
          "Unable to fetch tasks",
      });
  }
};


// ======================================================
// CREATE TASK
// ======================================================

const createTask = async (
  req,
  res
) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      due_date,
      project_id,
      assigned_to,
      autoAssign,
    } = req.body;

    // ----------------------------------------------
    // VALIDATION
    // ----------------------------------------------

    if (!title?.trim()) {
      return res
        .status(400)
        .json({
          message:
            "Task title is required",
        });
    }

    if (!project_id) {
      return res
        .status(400)
        .json({
          message:
            "Please select a project",
        });
    }

    // ----------------------------------------------
    // FIND PROJECT
    // ----------------------------------------------

    const project =
      await Project.findById(
        project_id
      ).populate(
        "members",
        "full_name name email role skills specialization experience_years"
      );

    if (!project) {
      return res
        .status(404)
        .json({
          message:
            "Selected project not found",
        });
    }

    const validMembers =
      (project.members || [])
        .filter(Boolean);

    let selectedUserId =
      assigned_to || null;

    let assignmentScore =
      null;

    let assignmentReason =
      "";

    let aiAssigned =
      false;

    let activeTaskCount =
      0;

    // handle boolean or string
    const shouldAutoAssign =
      autoAssign === true ||
      autoAssign === "true" ||
      !assigned_to;


    // ==================================================
    // MANUAL ASSIGNMENT
    // ==================================================

    if (
      assigned_to &&
      !shouldAutoAssign
    ) {
      const selectedMember =
        validMembers.find(
          (member) =>
            String(member._id) ===
            String(assigned_to)
        );

      if (!selectedMember) {
        return res
          .status(400)
          .json({
            message:
              "Selected user is not a member of this project",
          });
      }

      selectedUserId =
        selectedMember._id;

      assignmentReason =
        "Task manually assigned by manager.";
    }


    // ==================================================
    // AI AUTO ASSIGNMENT
    // ==================================================

    if (shouldAutoAssign) {
      if (
        validMembers.length === 0
      ) {
        return res
          .status(400)
          .json({
            message:
              "No members are available in this project for AI assignment",
          });
      }

      const rankedMembers =
        await Promise.all(
          validMembers.map(
            async (member) => {
              // Count current workload
              const activeTasks =
                await TaskModel
                  .countDocuments({
                    assigned_to:
                      member._id,

                    status: {
                      $ne:
                        "Completed",
                    },
                  });

              // AI / intelligence score
              const result =
                scoreCandidate(
                  member,
                  {
                    title:
                      title.trim(),

                    description:
                      description?.trim() ||
                      "",
                  },
                  activeTasks
                );

              const candidateScore =
                Number(
                  result?.score
                ) || 0;

              const reason =
                result?.reason ||
                "";

              console.log(
                "AI CANDIDATE:",
                {
                  id:
                    member._id.toString(),

                  name:
                    member.full_name ||
                    member.name ||
                    member.email,

                  skills:
                    member.skills ||
                    [],

                  specialization:
                    member.specialization ||
                    "",

                  experience_years:
                    member.experience_years ||
                    0,

                  activeTasks,

                  score:
                    candidateScore,

                  reason,
                }
              );

              return {
                member,
                activeTasks,
                score:
                  candidateScore,
                reason,
              };
            }
          )
        );

      // Highest score first
      rankedMembers.sort(
        (a, b) =>
          b.score -
          a.score
      );

      console.log(
        "AI RANKING:",
        rankedMembers.map(
          (candidate) => ({
            name:
              candidate.member
                .full_name ||
              candidate.member
                .name ||
              candidate.member
                .email,

            score:
              candidate.score,

            activeTasks:
              candidate.activeTasks,
          })
        )
      );

      const bestCandidate =
        rankedMembers[0];

      if (!bestCandidate) {
        return res
          .status(400)
          .json({
            message:
              "AI could not find a suitable member",
          });
      }

      selectedUserId =
        bestCandidate
          .member
          ._id;

      assignmentScore =
        bestCandidate.score;

      assignmentReason =
        bestCandidate.reason;

      activeTaskCount =
        bestCandidate
          .activeTasks;

      aiAssigned =
        true;

      console.log(
        "AI SELECTED MEMBER:",
        {
          name:
            bestCandidate
              .member
              .full_name ||
            bestCandidate
              .member
              .name ||
            bestCandidate
              .member
              .email,

          id:
            bestCandidate
              .member
              ._id
              .toString(),

          score:
            assignmentScore,

          reason:
            assignmentReason,
        }
      );
    }


    // ==================================================
    // CREATE TASK
    // ==================================================

    const createdTask =
      await TaskModel.create({
        title:
          title.trim(),

        description:
          description?.trim() ||
          "",

        status:
          status ||
          "To Do",

        priority:
          priority ||
          "Medium",

        due_date:
          due_date ||
          "",

        project_id,

        // This is the important user ID
        assigned_to:
          selectedUserId,

        assignment_score:
          assignmentScore,

        assignment_reason:
          assignmentReason,
      });


    // ==================================================
    // POPULATE CREATED TASK
    // ==================================================

    const populatedTask =
      await TaskModel
        .findById(
          createdTask._id
        )
        .populate(
          "assigned_to",
          "full_name name email role skills specialization experience_years"
        )
        .populate(
          "project_id",
          "title name status"
        );


    if (!populatedTask) {
      return res
        .status(500)
        .json({
          message:
            "Task was created but could not be retrieved",
        });
    }


    // Count workload after assignment
    if (
      populatedTask.assigned_to
    ) {
      activeTaskCount =
        await TaskModel
          .countDocuments({
            assigned_to:
              populatedTask
                .assigned_to
                ._id,

            status: {
              $ne:
                "Completed",
            },
          });
    }


    const taskData =
      formatTask(
        populatedTask
      );


    // ==================================================
    // FORMAT ASSIGNED USER FOR AI POPUP
    // ==================================================

    let assignedUser =
      null;

    if (
      populatedTask.assigned_to
    ) {
      assignedUser = {
        id:
          populatedTask
            .assigned_to
            ._id
            .toString(),

        full_name:
          populatedTask
            .assigned_to
            .full_name ||
          populatedTask
            .assigned_to
            .name ||
          "",

        name:
          populatedTask
            .assigned_to
            .full_name ||
          populatedTask
            .assigned_to
            .name ||
          "",

        email:
          populatedTask
            .assigned_to
            .email ||
          "",

        role:
          populatedTask
            .assigned_to
            .role ||
          "",

        skills:
          populatedTask
            .assigned_to
            .skills ||
          [],

        specialization:
          populatedTask
            .assigned_to
            .specialization ||
          "",

        experience_years:
          populatedTask
            .assigned_to
            .experience_years ||
          0,
      };
    }


    // ==================================================
    // RESPONSE
    // ==================================================

    return res
      .status(201)
      .json({
        message:
          "Task created successfully",

        task:
          taskData,

        aiAssignment: {
          assigned:
            aiAssigned,

          score:
            assignmentScore,

          reason:
            assignmentReason,

          user:
            assignedUser,

          activeTasks:
            activeTaskCount,
        },
      });
  } catch (error) {
    console.error(
      "Create task error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          error.message ||
          "Unable to create task",
      });
  }
};


// ======================================================
// UPDATE TASK
// ======================================================

const updateTask = async (
  req,
  res
) => {
  try {
    const {
      userId,
      role,
    } =
      getLoggedInUserInfo(req);

    if (!userId) {
      return res
        .status(401)
        .json({
          message:
            "Unable to identify logged-in user",
        });
    }

    const existingTask =
      await TaskModel.findById(
        req.params.id
      );

    if (!existingTask) {
      return res
        .status(404)
        .json({
          message:
            "Task not found",
        });
    }

    const manager =
      isManagerRole(role);

    // Member can modify only own task
    if (
      !manager &&
      String(
        existingTask.assigned_to
      ) !== String(userId)
    ) {
      return res
        .status(403)
        .json({
          message:
            "You are not allowed to update this task",
        });
    }

    // Member cannot change assignment
    if (!manager) {
      delete req.body
        .assigned_to;

      delete req.body
        .project_id;

      delete req.body
        .assignment_score;

      delete req.body
        .assignment_reason;
    }

    Object.assign(
      existingTask,
      req.body
    );

    await existingTask.save();

    const updatedTask =
      await TaskModel
        .findById(
          existingTask._id
        )
        .populate(
          "assigned_to",
          "full_name name email role skills specialization experience_years"
        )
        .populate(
          "project_id",
          "title name status"
        );

    return res
      .status(200)
      .json(
        formatTask(
          updatedTask
        )
      );
  } catch (error) {
    console.error(
      "Update task error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          error.message ||
          "Unable to update task",
      });
  }
};


// ======================================================
// DELETE TASK
// ======================================================

const removeTask = async (
  req,
  res
) => {
  try {
    const {
      userId,
      role,
    } =
      getLoggedInUserInfo(req);

    if (!userId) {
      return res
        .status(401)
        .json({
          message:
            "Unable to identify logged-in user",
        });
    }

    const manager =
      isManagerRole(role);

    // Only manager/admin may delete
    if (!manager) {
      return res
        .status(403)
        .json({
          message:
            "Only managers can delete tasks",
        });
    }

    const deletedTask =
      await TaskModel
        .findByIdAndDelete(
          req.params.id
        );

    if (!deletedTask) {
      return res
        .status(404)
        .json({
          message:
            "Task not found",
        });
    }

    return res
      .status(200)
      .json({
        message:
          "Task deleted successfully",
      });
  } catch (error) {
    console.error(
      "Delete task error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          error.message ||
          "Unable to delete task",
      });
  }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
  fetchTasks,
  createTask,
  updateTask,
  removeTask,
};