import type { User } from "./db";

export type QueryParams = {
  limit: number;
  offset: number;
  otherParams: { [key: string]: string };
};

export type AuthTokenPayload = {
  userId: string;
  code: string;
  firstName: string;
  surname: string;
};

declare global {
  namespace Express {
    interface Locals {
      user?: { role: User["role"] } & AuthTokenPayload;
    }
  }
}
