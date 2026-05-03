const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  addMember,
} = require("../controllers/projectController");
const { protect } = require("../middleware/auth");
const { adminOnly } = require("../middleware/role");

// POST /api/projects — Admin only
router.post("/", protect, adminOnly, createProject);

// GET /api/projects — All authenticated users
router.get("/", protect, getProjects);

// PUT /api/projects/:id/add-member — Admin only
router.put("/:id/add-member", protect, adminOnly, addMember);

module.exports = router;
