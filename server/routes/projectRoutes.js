const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  fetchProjects,
  fetchProjectById,
  createProject,
  updateProject,
  removeProject,
  addProjectMember,
  removeProjectMember,
} = require(
  "../controllers/projectController"
);

router.get(
  "/",
  authMiddleware,
  fetchProjects
);

router.get(
  "/:id",
  authMiddleware,
  fetchProjectById
);

router.post(
  "/",
  authMiddleware,
  createProject
);

router.patch(
  "/:id",
  authMiddleware,
  updateProject
);

router.delete(
  "/:id",
  authMiddleware,
  removeProject
);

router.post(
  "/:id/members",
  authMiddleware,
  addProjectMember
);

router.delete(
  "/:id/members/:userId",
  authMiddleware,
  removeProjectMember
);

module.exports = router;