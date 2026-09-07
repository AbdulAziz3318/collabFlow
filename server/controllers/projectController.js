const Project = require(
  "../models/projectModel"
);

const Task = require(
  "../models/taskModel"
);

const User = require(
  "../models/userModel"
);


// ================================
// GET PROJECTS
// ================================

const fetchProjects = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let filter = {};

    if (role === "Member") {
      filter = {
        members: userId,
      };
    } else if (role === "Manager") {
      filter = {
        $or: [
          {
            manager: userId,
          },
          {
            members: userId,
          },
        ],
      };
    }

    const projects =
      await Project.find(filter)
        .populate(
          "members",
          "full_name email role skills specialization experience_years"
        )
        .populate(
          "manager",
          "full_name email role"
        )
        .sort({
          createdAt: -1,
        });

    const result =
      await Promise.all(
        projects.map(
          async (project) => {
            const totalTasks =
              await Task.countDocuments({
                project_id:
                  project._id,
              });

            const completedTasks =
              await Task.countDocuments({
                project_id:
                  project._id,
                status: "Completed",
              });

            const progress =
              totalTasks === 0
                ? 0
                : Math.round(
                    (completedTasks /
                      totalTasks) *
                      100
                  );

            const data =
              project.toObject();

            data.id =
              project._id.toString();

            data.totalTasks =
              totalTasks;

            data.completedTasks =
              completedTasks;

            data.progress =
              progress;

            delete data._id;
            delete data.__v;

            return data;
          }
        )
      );

    return res.status(200).json(
      result
    );
  } catch (error) {
    console.error(
      "Fetch projects error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch projects",
    });
  }
};


// ================================
// GET ONE PROJECT
// ================================

const fetchProjectById = async (
  req,
  res
) => {
  try {
    const project =
      await Project.findById(
        req.params.id
      )
        .populate(
          "members",
          "full_name email role skills specialization experience_years"
        )
        .populate(
          "manager",
          "full_name email role"
        );

    if (!project) {
      return res.status(404).json({
        message:
          "Project not found",
      });
    }

    const userId = req.user.id;

    const isMember =
      project.members.some(
        (member) =>
          member._id.toString() ===
          userId
      );

    const isManager =
      project.manager?._id?.toString() ===
      userId;

    const isAdmin =
      req.user.role === "Admin";

    if (
      !isMember &&
      !isManager &&
      !isAdmin
    ) {
      return res.status(403).json({
        message:
          "You do not have access to this project",
      });
    }

    const tasks =
      await Task.find({
        project_id:
          project._id,
      })
        .populate(
          "assigned_to",
          "full_name email specialization"
        )
        .sort({
          createdAt: -1,
        });

    const totalTasks =
      tasks.length;

    const completedTasks =
      tasks.filter(
        (task) =>
          task.status ===
          "Completed"
      ).length;

    const progress =
      totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks /
              totalTasks) *
              100
          );

    const projectData =
      project.toObject();

    projectData.id =
      project._id.toString();

    projectData.progress =
      progress;

    projectData.totalTasks =
      totalTasks;

    projectData.completedTasks =
      completedTasks;

    projectData.tasks =
      tasks;

    delete projectData._id;
    delete projectData.__v;

    return res.status(200).json(
      projectData
    );
  } catch (error) {
    console.error(
      "Fetch project error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch project",
    });
  }
};


// ================================
// CREATE PROJECT
// ================================

const createProject = async (
  req,
  res
) => {
  try {
    const {
      title,
      description,
      status,
      members,
      dueDate,
      manager,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        message:
          "Project title is required",
      });
    }

    let managerId =
      manager || null;

    if (
      req.user.role === "Manager"
    ) {
      managerId =
        req.user.id;
    }

    const memberIds =
      Array.isArray(members)
        ? [...members]
        : [];

    if (
      managerId &&
      !memberIds.includes(
        managerId
      )
    ) {
      memberIds.push(
        managerId
      );
    }

    const project =
      await Project.create({
        title: title.trim(),

        description:
          description?.trim() ||
          "",

        status:
          status || "Planning",

        members:
          memberIds,

        manager:
          managerId,

        dueDate:
          dueDate || "",
      });

    const populatedProject =
      await Project.findById(
        project._id
      )
        .populate(
          "members",
          "full_name email role skills specialization"
        )
        .populate(
          "manager",
          "full_name email role"
        );

    return res.status(201).json(
      populatedProject
    );
  } catch (error) {
    console.error(
      "Create project error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to create project",
    });
  }
};


// ================================
// UPDATE PROJECT
// ================================

const updateProject = async (
  req,
  res
) => {
  try {
    const project =
      await Project.findById(
        req.params.id
      );

    if (!project) {
      return res.status(404).json({
        message:
          "Project not found",
      });
    }

    const isManager =
      project.manager?.toString() ===
      req.user.id;

    const isAdmin =
      req.user.role === "Admin";

    if (
      !isManager &&
      !isAdmin
    ) {
      return res.status(403).json({
        message:
          "Only the project manager can update this project",
      });
    }

    Object.assign(
      project,
      req.body
    );

    await project.save();

    return res.status(200).json(
      project
    );
  } catch (error) {
    console.error(
      "Update project error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update project",
    });
  }
};


// ================================
// ADD REGISTERED MEMBER
// ================================

const addProjectMember = async (
  req,
  res
) => {
  try {
    const {
      userId,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        message:
          "User ID is required",
      });
    }

    const project =
      await Project.findById(
        req.params.id
      );

    if (!project) {
      return res.status(404).json({
        message:
          "Project not found",
      });
    }

    const isManager =
      project.manager?.toString() ===
      req.user.id;

    const isAdmin =
      req.user.role === "Admin";

    if (
      !isManager &&
      !isAdmin
    ) {
      return res.status(403).json({
        message:
          "Only the project manager can add members",
      });
    }

    const user =
      await User.findById(
        userId
      );

    if (!user) {
      return res.status(404).json({
        message:
          "Registered user not found",
      });
    }

    const alreadyExists =
      project.members.some(
        (id) =>
          id.toString() ===
          userId
      );

    if (!alreadyExists) {
      project.members.push(
        userId
      );

      await project.save();
    }

    const updated =
      await Project.findById(
        project._id
      )
        .populate(
          "members",
          "full_name email role skills specialization experience_years"
        )
        .populate(
          "manager",
          "full_name email role"
        );

    return res.status(200).json({
      message:
        "Member added successfully",
      project: updated,
    });
  } catch (error) {
    console.error(
      "Add member error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to add member",
    });
  }
};


// ================================
// REMOVE MEMBER
// ================================

const removeProjectMember =
  async (req, res) => {
    try {
      const project =
        await Project.findById(
          req.params.id
        );

      if (!project) {
        return res.status(404).json({
          message:
            "Project not found",
        });
      }

      const isManager =
        project.manager?.toString() ===
        req.user.id;

      const isAdmin =
        req.user.role === "Admin";

      if (
        !isManager &&
        !isAdmin
      ) {
        return res.status(403).json({
          message:
            "Only the project manager can remove members",
        });
      }

      project.members =
        project.members.filter(
          (memberId) =>
            memberId.toString() !==
            req.params.userId
        );

      await project.save();

      return res.status(200).json({
        message:
          "Member removed successfully",
      });
    } catch (error) {
      console.error(
        "Remove member error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to remove member",
      });
    }
  };


// ================================
// DELETE PROJECT
// ================================

const removeProject = async (
  req,
  res
) => {
  try {
    const project =
      await Project.findById(
        req.params.id
      );

    if (!project) {
      return res.status(404).json({
        message:
          "Project not found",
      });
    }

    const isManager =
      project.manager?.toString() ===
      req.user.id;

    const isAdmin =
      req.user.role === "Admin";

    if (
      !isManager &&
      !isAdmin
    ) {
      return res.status(403).json({
        message:
          "Only the project manager can delete this project",
      });
    }

    await Task.deleteMany({
      project_id:
        project._id,
    });

    await project.deleteOne();

    return res.status(200).json({
      message:
        "Project deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete project error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to delete project",
    });
  }
};


module.exports = {
  fetchProjects,
  fetchProjectById,
  createProject,
  updateProject,
  removeProject,
  addProjectMember,
  removeProjectMember,
};