import { get } from "env-var";

const isTest = process.env.NODE_ENV === "test";

export const envs = {
  PORT: get(isTest ? "VITE_PORT" : "PORT")
    .required()
    .asPortNumber(),
  DB_URL: get(isTest ? "VITE_DB_URL" : "DB_URL")
    .required()
    .asString(),
  JWT_SEED: get("JWT_SEED").required().asString(),
};
