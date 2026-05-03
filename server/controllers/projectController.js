const Project = require("../models/Project");
const User = require("../models/User");

// @desc   Create project
// @route  POST /api/projects
// @access Admin
const createProject = async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Project title is required" });
  }

  try {
    const project = await Project.create({
      title,
      description,
      createdBy: req.user._id,
      members: [req.user._id],
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Get all projects
// @route  GET /api/projects
// @access Private
const getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === "Admin") {
      projects = await Project.find()
        .populate("createdBy", "name email")
        .populate("members", "name email");
    } else {
      projects = await Project.find({ members: req.user._id })
        .populate("createdBy", "name email")
        .populate("members", "name email");
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Add member to project
// @route  PUT /api/projects/:id/add-member
// @access Admin
const addMember = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (project.members.includes(userId)) {
      return res.status(400).json({ message: "User already a member" });
    }

    project.members.push(userId);
    await project.save();

    const updated = await Project.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members", "name email");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createProject, getProjects, addMember };
