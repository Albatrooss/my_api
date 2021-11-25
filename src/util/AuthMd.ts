import { MiddlewareFn } from "type-graphql";
import { MyContext } from "./types";

export const AuthMd: (
  service?: string,
) => MiddlewareFn<MyContext> =
  service =>
  ({ context: { req } }, next) => {
    const from = req.headers['ohohoh-from'];
    console.log('from', from)
    if (!from || from !== service) throw new Error('access denied')
    return next();
  };
