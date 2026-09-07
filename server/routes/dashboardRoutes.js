const express = require("express");

const router = express.Router();

const {
  fetchStats,
} = require("../controllers/dashboardController");

router.get("/stats", fetchStats);

module.exports = router;