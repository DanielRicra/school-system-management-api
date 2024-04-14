import { get } from "env-var";

export const envs = {
  PORT: get("PORT").required().asPortNumber(),
  DB_URL: get("DB_URL").required().asString(),
};
