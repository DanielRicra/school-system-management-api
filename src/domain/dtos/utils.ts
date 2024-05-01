import { is, string, uuid } from "valibot";

type IssuesType = {
  path?: { key: unknown }[];
  message: string;
};

export function mapErrorsMessages(
  issues: IssuesType[]
): Record<string, string> {
  const errorsObj: { [key: string]: string } = {};
  for (const issue of issues) {
    const key = issue.path?.[0].key as string;
    errorsObj[key] = issue.message.replaceAll('"', "'");
  }

  return errorsObj;
}

export function isUUIDFormat(word: string) {
  const userIdSchema = string([uuid()]);

  if (is(userIdSchema, word)) {
    return true;
  }

  return false;
}
