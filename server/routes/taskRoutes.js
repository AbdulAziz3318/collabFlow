const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  fetchTasks,
  createTask,
  updateTask,
  removeTask,
} = require("../controllers/taskController");

router.get("/", authMiddleware, fetchTasks);

router.post("/", authMiddleware, createTask);

router.patch("/:id", authMiddleware, updateTask);

router.delete("/:id", authMiddleware, removeTask);

module.exports = router;