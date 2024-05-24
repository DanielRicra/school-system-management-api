import type { NextFunction, Request, Response } from "express";

export function handleErrors(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(500).json({ message: "Internal server error." });
}
