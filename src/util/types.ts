import { Request, Response } from 'express';
import { SessionData } from 'express-session';

export type MyContext = {
    req: Request & { session: SessionData & { userId: number } };
    res: Response;
};
