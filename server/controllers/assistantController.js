const Task = require("../models/taskModel");
const User = require("../models/userModel");
const Project = require("../models/projectModel");

const normalize = (text = "") => {
  return String(text)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
};

const getUserInfo = (req) => {
  const userId =
    req.user?.id ||
    req.user?._id;

  const role = normalize(
    req.user?.role || ""
  );

  return {
    userId,
    role,
  };
};

const isManager = (role) => {
  return [
    "manager",
    "admin",
    "project manager",
    "project_manager",
  ].includes(role);
};

const getTaskFilter = (
  userId,
  role
) => {
  if (isManager(role)) {
    return {};
  }

  return {
    assigned_to: userId,
  };
};

const formatTaskName = (
  task
) => {
  return (
    task?.title ||
    "Untitled Task"
  );
};

const formatMemberName = (
  member
) => {
  return (
    member?.full_name ||
    member?.name ||
    member?.email ||
    "Unknown Member"
  );
};

const assistantChat = async (
  req,
  res
) => {
  try {
    const {
      userId,
      role,
    } = getUserInfo(req);

    if (!userId) {
      return res.status(401).json({
        message:
          "Unauthorized user.",
      });
    }

    const question =
      normalize(
        req.body?.message ||
        req.body?.question ||
        ""
      );

    if (!question) {
      return res.status(400).json({
        message:
          "Please enter a question.",
      });
    }

    const taskFilter =
      getTaskFilter(
        userId,
        role
      );

    const tasks =
      await Task.find(
        taskFilter
      )
        .populate(
          "assigned_to",
          "full_name email skills specialization experience_years"
        )
        .populate(
          "project_id",
          "title name"
        )
        .sort({
          updatedAt: -1,
        });

    const projects =
      await Project.find({})
        .populate(
          "members",
          "full_name email skills specialization experience_years"
        );

    const users =
      await User.find({})
        .select(
          "full_name email role skills specialization experience_years"
        );

    const todoTasks =
      tasks.filter(
        (task) =>
          task.status ===
          "To Do"
      );

    const inProgressTasks =
      tasks.filter(
        (task) =>
          task.status ===
          "In Progress"
      );

    const completedTasks =
      tasks.filter(
        (task) =>
          task.status ===
          "Completed"
      );

    let answer = "";

    let data = null;


    // ================================================
    // TOTAL TASKS
    // ================================================

    if (
      question.includes(
        "total tasks"
      ) ||
      question.includes(
        "how many tasks"
      )
    ) {
      answer =
        `You currently have ${tasks.length} task(s). ` +
        `${todoTasks.length} are To Do, ` +
        `${inProgressTasks.length} are In Progress, ` +
        `and ${completedTasks.length} are Completed.`;

      data = {
        total:
          tasks.length,

        todo:
          todoTasks.length,

        inProgress:
          inProgressTasks.length,

        completed:
          completedTasks.length,
      };
    }


    // ================================================
    // PENDING TASKS
    // ================================================

    else if (
      question.includes(
        "pending"
      )
    ) {
      const pending =
        tasks.filter(
          (task) =>
            task.status !==
            "Completed"
        );

      answer =
        `There are ${pending.length} pending task(s): ` +
        `${todoTasks.length} To Do and ` +
        `${inProgressTasks.length} In Progress.`;

      data =
        pending.map(
          (task) => ({
            id:
              task._id,

            title:
              formatTaskName(
                task
              ),

            status:
              task.status,
          })
        );
    }


    // ================================================
    // COMPLETED TASKS
    // ================================================

    else if (
      question.includes(
        "completed"
      ) ||
      question.includes(
        "complete tasks"
      )
    ) {
      if (
        completedTasks.length ===
        0
      ) {
        answer =
          "There are currently no completed tasks.";
      } else {
        answer =
          `There are ${completedTasks.length} completed task(s): ` +
          completedTasks
            .map(
              (task) =>
                formatTaskName(
                  task
                )
            )
            .join(", ") +
          ".";
      }

      data =
        completedTasks;
    }


    // ================================================
    // IN PROGRESS TASKS
    // ================================================

    else if (
      question.includes(
        "in progress"
      ) ||
      question.includes(
        "progress tasks"
      )
    ) {
      if (
        inProgressTasks.length ===
        0
      ) {
        answer =
          "There are currently no tasks in progress.";
      } else {
        answer =
          `There are ${inProgressTasks.length} task(s) in progress: ` +
          inProgressTasks
            .map(
              (task) =>
                formatTaskName(
                  task
                )
            )
            .join(", ") +
          ".";
      }

      data =
        inProgressTasks;
    }


    // ================================================
    // TO DO TASKS
    // ================================================

    else if (
      question.includes(
        "to do"
      ) ||
      question.includes(
        "todo"
      )
    ) {
      if (
        todoTasks.length ===
        0
      ) {
        answer =
          "There are currently no To Do tasks.";
      } else {
        answer =
          `There are ${todoTasks.length} To Do task(s): ` +
          todoTasks
            .map(
              (task) =>
                formatTaskName(
                  task
                )
            )
            .join(", ") +
          ".";
      }

      data =
        todoTasks;
    }


    // ================================================
    // PROJECTS
    // ================================================

    else if (
      question.includes(
        "projects"
      ) ||
      question.includes(
        "project list"
      )
    ) {
      if (
        projects.length ===
        0
      ) {
        answer =
          "No projects are currently available.";
      } else {
        answer =
          `There are ${projects.length} project(s): ` +
          projects
            .map(
              (project) =>
                project.title ||
                project.name ||
                "Untitled Project"
            )
            .join(", ") +
          ".";
      }

      data =
        projects;
    }


    // ================================================
    // TEAM MEMBERS
    // ================================================

    else if (
      question.includes(
        "team members"
      ) ||
      question.includes(
        "members"
      )
    ) {
      answer =
        `There are ${users.length} registered member(s): ` +
        users
          .map(
            (member) =>
              formatMemberName(
                member
              )
          )
          .join(", ") +
        ".";

      data =
        users;
    }


    // ================================================
    // LOWEST WORKLOAD
    // ================================================

    else if (
      question.includes(
        "lowest workload"
      ) ||
      question.includes(
        "least workload"
      ) ||
      question.includes(
        "free member"
      )
    ) {
      const membersWithWorkload =
        users.map(
          (member) => {
            const activeCount =
              tasks.filter(
                (task) =>
                  String(
                    task.assigned_to?._id ||
                    task.assigned_to
                  ) ===
                    String(
                      member._id
                    ) &&
                  task.status !==
                    "Completed"
              ).length;

            return {
              member,
              activeCount,
            };
          }
        );

      membersWithWorkload.sort(
        (a, b) =>
          a.activeCount -
          b.activeCount
      );

      const best =
        membersWithWorkload[0];

      if (!best) {
        answer =
          "No team members are available.";
      } else {
        answer =
          `${formatMemberName(
            best.member
          )} currently has the lowest workload with ${best.activeCount} active task(s).`;

        data = {
          member:
            best.member,

          activeTasks:
            best.activeCount,
        };
      }
    }


    // ================================================
    // HIGHEST WORKLOAD
    // ================================================

    else if (
      question.includes(
        "highest workload"
      ) ||
      question.includes(
        "most tasks"
      ) ||
      question.includes(
        "busy member"
      )
    ) {
      const membersWithWorkload =
        users.map(
          (member) => {
            const activeCount =
              tasks.filter(
                (task) =>
                  String(
                    task.assigned_to?._id ||
                    task.assigned_to
                  ) ===
                    String(
                      member._id
                    ) &&
                  task.status !==
                    "Completed"
              ).length;

            return {
              member,
              activeCount,
            };
          }
        );

      membersWithWorkload.sort(
        (a, b) =>
          b.activeCount -
          a.activeCount
      );

      const busiest =
        membersWithWorkload[0];

      if (!busiest) {
        answer =
          "No team members are available.";
      } else {
        answer =
          `${formatMemberName(
            busiest.member
          )} currently has the highest workload with ${busiest.activeCount} active task(s).`;

        data = {
          member:
            busiest.member,

          activeTasks:
            busiest.activeCount,
        };
      }
    }


    // ================================================
    // REACT MEMBER
    // ================================================

    else if (
      question.includes(
        "react"
      )
    ) {
      const reactMembers =
        users.filter(
          (member) =>
            Array.isArray(
              member.skills
            ) &&
            member.skills.some(
              (skill) =>
                normalize(
                  skill
                ) ===
                "react"
            )
        );

      if (
        reactMembers.length ===
        0
      ) {
        answer =
          "No member with React skills was found.";
      } else {
        answer =
          `The member(s) with React skills are: ` +
          reactMembers
            .map(
              (member) =>
                formatMemberName(
                  member
                )
            )
            .join(", ") +
          ".";

        data =
          reactMembers;
      }
    }


    // ================================================
    // BACKEND MEMBER
    // ================================================

    else if (
      question.includes(
        "backend"
      ) ||
      question.includes(
        "node"
      )
    ) {
      const backendMembers =
        users.filter(
          (member) => {
            const skills =
              Array.isArray(
                member.skills
              )
                ? member.skills.map(
                    normalize
                  )
                : [];

            const specialization =
              normalize(
                member.specialization ||
                  ""
              );

            return (
              skills.includes(
                "node.js"
              ) ||
              skills.includes(
                "express"
              ) ||
              specialization.includes(
                "backend"
              )
            );
          }
        );

      if (
        backendMembers.length ===
        0
      ) {
        answer =
          "No backend developer was found.";
      } else {
        answer =
          `The recommended backend-capable member(s) are: ` +
          backendMembers
            .map(
              (member) =>
                formatMemberName(
                  member
                )
            )
            .join(", ") +
          ".";

        data =
          backendMembers;
      }
    }


    // ================================================
    // SUMMARY
    // ================================================

    else if (
      question.includes(
        "summary"
      ) ||
      question.includes(
        "status"
      )
    ) {
      answer =
        `CollabFlow currently contains ${projects.length} project(s) and ${tasks.length} visible task(s). ` +
        `${todoTasks.length} task(s) are To Do, ` +
        `${inProgressTasks.length} are In Progress, ` +
        `and ${completedTasks.length} are Completed.`;

      data = {
        projects:
          projects.length,

        tasks:
          tasks.length,

        todo:
          todoTasks.length,

        inProgress:
          inProgressTasks.length,

        completed:
          completedTasks.length,
      };
    }


    // ================================================
    // DEFAULT
    // ================================================

    else {
      answer =
        "I can help you with project status, task counts, pending tasks, completed tasks, team members, workload, React developers, backend developers and project summaries. Try asking: 'How many tasks are pending?'";
    }


    return res.status(200).json({
      success: true,

      question:
        req.body?.message ||
        req.body?.question,

      answer,

      data,
    });

  } catch (error) {
    console.error(
      "ASSISTANT ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to process assistant request.",

      error:
        error.message,
    });
  }
};


module.exports = {
  assistantChat,
};