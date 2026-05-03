import { Router, Request, Response } from "express";
import Project from "../models/Project";
import { authMiddleware, adminMiddleware } from "../middlewares/auth";

const router = Router();

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { name, description, members } = req.body;
      const project = new Project({
        name,
        description,
        adminId: (req as any).user.userId,
        members,
      });
      await project.save();
      res.status(201).json(project);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  },
);

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userRole = (req as any).user.role;
    const userId = (req as any).user.userId;
    let projects;
    if (userRole === "Admin") {
      projects = await Project.find({ adminId: userId }).populate(
        "members",
        "name email",
      );
    } else {
      projects = await Project.find({ members: userId }).populate(
        "adminId",
        "name email",
      );
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
