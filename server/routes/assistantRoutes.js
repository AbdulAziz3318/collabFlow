const express = require("express");

const router = express.Router();

const {
  assistantChat,
} = require("../controllers/assistantController");

const authMiddleware =
  require("../middleware/authMiddleware");


// Debug check
console.log(
  "assistantChat type:",
  typeof assistantChat
);

console.log(
  "authMiddleware type:",
  typeof authMiddleware
);


router.post(
  "/chat",
  authMiddleware,
  assistantChat
);


module.exports = router;