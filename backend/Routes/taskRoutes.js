const express = require("express");
const {
  createTask,
  getTasks,
  getAllTask,
  updateTaskStatus,
} = require("../controllers/taskController");

const router = express.Router();

router.post("/", createTask); // Create a task
router.get("/:eventId", getTasks); // Get tasks for a specific event
router.get("/", getAllTask); // Get all tasks
router.put("/:id", updateTaskStatus); // Update a task status

module.exports = router;
