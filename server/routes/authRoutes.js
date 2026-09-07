const express = require("express");

const {
  register,
  login,
  me,
  resetPassword,
} = require("../controllers/authController");

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get(
  "/me",
  authMiddleware,
  me
);
router.patch(
  "/reset-password",
  authMiddleware,
  resetPassword
);
module.exports = router;