import jwt from "jsonwebtoken";
import { envs } from "./envs";

const JWT_SEED = envs.JWT_SEED;

export class JwtAdapter {
  static async generateToken(
    payload: Record<string, unknown>,
    duration = "1h"
  ): Promise<string | null> {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (err, token) => {
        if (err || !token) return resolve(null);
        resolve(token);
      });
    });
  }

  static validateToken<T>(token: string): Promise<T | null> {
    return new Promise((resolve) => {
      jwt.verify(token, JWT_SEED, (error, decoded) => {
        if (error) return resolve(null);

        resolve(decoded as T);
      });
    });
  }
}
