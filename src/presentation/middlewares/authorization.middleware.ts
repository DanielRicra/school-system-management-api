import type { RequestHandler } from "express";

export class AuthorizationMiddleware {
  static checkOwnerOrAdmin: RequestHandler = (req, res, next) => {
    const { user } = res.locals;
    if (user?.role === "admin") {
      return next();
    }

    if (user?.userId !== req.params.id) {
      return res
        .status(403)
        .json({ message: "Access Denied: Resource Not Owned." });
    }

    next();
  };
}
