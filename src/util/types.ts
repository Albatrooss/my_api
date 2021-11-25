import { Request, Response } from 'express';
import { SessionData } from 'express-session';

export type MyContext = {
    req: Request & { session: SessionData & { userId: number, xmasId: number } };
    res: Response;
};

export type Robillard = 
    | 'tim' | 'caitlin' | 'andrew' | 'kyla' 
    | 'adam' | 'hannah' | 'hugh' | 'patti';