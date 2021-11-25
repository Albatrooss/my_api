import { MiddlewareFn } from "type-graphql";
import { MyContext } from "./types";

export const AuthMd: (
  service?: string,
) => MiddlewareFn<MyContext> =
  service =>
  ({ context: { req } }, next) => {
    console.log('host', req.baseUrl)
    console.log('ogurl', req.originalUrl)
    console.log('url', req.url)
    if (req.hostname !== process.env[`SERVICE_${service}`]) throw new Error('access denied')
    return next();
  };
