import type { DTOCreateResult } from "../../types";

export class SignInUserDTO {
  private constructor(
    public code: string,
    public password: string
  ) {}

  static create(object: {
    [key: string]: unknown;
  }): DTOCreateResult<SignInUserDTO> {
    const { code, password } = object;

    if (!code) return ["Missing code"];
    if (!password) return ["Missing password"];
    if (typeof code !== "string") return ["Code must be an string"];
    if (typeof password !== "string") return ["Password must be an string"];

    return [undefined, new SignInUserDTO(code, password)];
  }
}
