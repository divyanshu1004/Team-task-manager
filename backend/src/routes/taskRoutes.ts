import { Router, Request, Response } from "express";
import Task from "../models/Task";
import { authMiddleware, adminMiddleware } from "../middlewares/auth";

const router = Router();

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { title, description, dueDate, projectId, assignedTo } = req.body;
      const task = new Task({
        title,
        description,
        dueDate,
        projectId,
        assignedTo,
      });
      await task.save();
      res.status(201).json(task);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  },
);

router.get(
  "/project/:projectId",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({
        projectId: req.params.projectId,
      }).populate("assignedTo", "name email");
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  },
);

router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
