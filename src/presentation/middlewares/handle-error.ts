import type { NextFunction, Request, Response } from "express";

export function handleErrors(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(500).json({ message: error.message });
}
