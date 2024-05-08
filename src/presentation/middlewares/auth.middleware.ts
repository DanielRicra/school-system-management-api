import type { NextFunction, RequestHandler, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import type { AuthTokenPayload } from "../../types";
import { db, users } from "../../db";
import { eq } from "drizzle-orm";

export class AuthMiddleware {
  static validateJwt: RequestHandler = async (
    req,
    res,
    next
  ): Promise<void> => {
    const authorization = req.header("Authorization");

    if (!authorization) {
      res.status(400).json({ message: "Authorization header is required." });
      return;
    }

    if (!authorization.startsWith("Bearer ")) {
      res.status(400).json({ message: "Invalid Bearer token." });
      return;
    }

    const [_, token] = authorization.split(" ");

    const payload = await JwtAdapter.validateToken<AuthTokenPayload>(token);

    if (!payload) {
      res.status(401).json({ message: "Invalid token." });
      return;
    }

    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, payload.userId));

      if (!user) {
        res.status(401).json({ message: "User not found." });
        return;
      }
      res.locals.user = { ...payload, role: user.role };
      next();
    } catch (error) {
      res.status(500).json({ message: "Internal server error." });
    }
  };

  static checkUserRole(role: "admin" | "student" | "teacher") {
    return (_req: Request, res: Response, next: NextFunction): void => {
      const { user } = res.locals;

      if (!user) {
        res.status(401).json({ message: "Please log in." });
        return;
      }

      if (user.role === "admin") {
        next();
        return;
      }

      if (user.role !== role) {
        res
          .status(403)
          .json({ message: "You are not authorized to perform this action." });
        return;
      }
      next();
    };
  }
}
