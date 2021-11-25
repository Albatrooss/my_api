import { MiddlewareFn } from "type-graphql";
import { MyContext } from "./types";

export const AuthMd: (
  service?: string,
) => MiddlewareFn<MyContext> =
  service =>
  ({ context: { req } }, next) => {
    console.log('host', req.hostname)
    if (req.hostname !== process.env[`SERVICE_${service}`]) throw new Error('access denied')
    return next();
  };
