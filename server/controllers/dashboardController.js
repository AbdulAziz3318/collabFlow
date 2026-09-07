const {
  getStats,
} = require("../models/dashboardModel");

const fetchStats = async (req, res) => {
  try {
    const stats = await getStats();

    res.json(stats);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  fetchStats,
};