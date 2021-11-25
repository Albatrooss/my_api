import { MiddlewareFn } from "type-graphql";
import { MyContext } from "./types";

export const AuthMd: (
  service?: string,
) => MiddlewareFn<MyContext> =
  service =>
  ({ context: { req } }, next) => {
    if (req.hostname !== process.env[`SERVICE_${service}`]) throw new Error('access denied')
    return next();
  };
