import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "No token, authorization denied" });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if ((req as any).user.role !== "Admin") {
    res.status(403).json({ message: "Admin resources access denied" });
    return;
  }
  next();
};
