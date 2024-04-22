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
