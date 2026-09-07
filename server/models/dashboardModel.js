const Project = require("./projectModel");
const Task = require("./taskModel");
const User = require("./userModel");

const getStats = async () => {
  const [
    projects,
    tasks,
    completed,
    team,
  ] = await Promise.all([
    Project.countDocuments(),
    Task.countDocuments(),
    Task.countDocuments({
      status: "Completed",
    }),
    User.countDocuments(),
  ]);

  return {
    projects,
    tasks,
    completed,
    team,
  };
};

module.exports = {
  getStats,
};