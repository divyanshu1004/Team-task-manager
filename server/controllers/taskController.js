const Task = require("../models/Task");
const User = require("../models/User");

// @desc   Create task
// @route  POST /api/tasks
// @access Admin
const createTask = async (req, res) => {
  const { title, description, project, assignedTo, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Task title is required" });
  }
  if (!project) {
    return res.status(400).json({ message: "Project is required" });
  }
  if (!dueDate || isNaN(new Date(dueDate))) {
    return res.status(400).json({ message: "Valid due date is required" });
  }

  try {
    // Validate assignedTo inside try so invalid ObjectId format is caught
    if (assignedTo) {
      const userExists = await User.findById(assignedTo);
      if (!userExists) {
        return res.status(400).json({ message: "Assigned user does not exist" });
      }
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo: assignedTo || null,
      dueDate,
    });
    const populated = await Task.findById(task._id)
      .populate("project", "title")
      .populate("assignedTo", "name email");
    res.status(201).json(populated);
  } catch (err) {
    // CastError = invalid ObjectId passed for project/assignedTo
    if (err.name === "CastError") {
      return res.status(400).json({ message: `Invalid ID format for field: ${err.path}` });
    }
    res.status(500).json({ message: err.message });
  }
};

// @desc   Get all tasks
// @route  GET /api/tasks
// @access Private
const getTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === "Admin") {
      tasks = await Task.find()
        .populate("project", "title")
        .populate("assignedTo", "name email");
    } else {
      tasks = await Task.find({ assignedTo: req.user._id })
        .populate("project", "title")
        .populate("assignedTo", "name email");
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Update task status (Members can update their assigned tasks, Admin can update any)
// @route  PUT /api/tasks/:id
// @access Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Members can only update their own assigned tasks
    if (
      req.user.role !== "Admin" &&
      task.assignedTo?.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    const { status, title, description, assignedTo, dueDate } = req.body;

    if (status) {
      if (!["Pending", "In Progress", "Completed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      task.status = status;
    }

    // Admin can update all fields
    if (req.user.role === "Admin") {
      if (title) task.title = title;
      if (description !== undefined) task.description = description;
      if (assignedTo !== undefined) task.assignedTo = assignedTo;
      if (dueDate) {
        if (isNaN(new Date(dueDate))) {
          return res.status(400).json({ message: "Invalid due date" });
        }
        task.dueDate = dueDate;
      }
    }

    await task.save();
    const updated = await Task.findById(task._id)
      .populate("project", "title")
      .populate("assignedTo", "name email");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Delete task
// @route  DELETE /api/tasks/:id
// @access Admin
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
