const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/auth");
const { adminOnly } = require("../middleware/role");

// POST /api/tasks — Admin only
router.post("/", protect, adminOnly, createTask);

// GET /api/tasks — All authenticated users
router.get("/", protect, getTasks);

// PUT /api/tasks/:id — Members (own tasks) + Admin (all tasks)
router.put("/:id", protect, updateTask);

// DELETE /api/tasks/:id — Admin only
router.delete("/:id", protect, adminOnly, deleteTask);

module.exports = router;
