import 'reflect-metadata';
import 'dotenv-safe/config';
import express from 'express';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import session from 'express-session';
import { COOKIE_NAME, __prod__ } from './util/constants';
import { Quote } from './entities/Quote';
import { User } from './entities/User';
import { QuoteResolver } from './resolvers/QuoteResolver';
import { UserResolver } from './resolvers/User';
import connectPgSimple from 'connect-pg-simple';

const { WHITELIST_STR, POSTGRES_PASSWORD, POSTGRES_USERNAME } = process.env;
const whitelist = WHITELIST_STR ? WHITELIST_STR.split(',') : [];

const main = async () => {
    let retries = 5;
    while (retries) {
        try {
            await createConnection({
                type: 'postgres',
                host: 'localhost',
                database: 'handyman',
                username: POSTGRES_USERNAME,
                password: POSTGRES_PASSWORD,
                logging: true,
                synchronize: true,
                entities: [Quote, User],
            });
            break;
        } catch (error) {
            console.log(error);
            retries--;
            console.log(`retries left: ${retries}`);
            await new Promise(res => setTimeout(res, 5000));
        }
    }

    const pgSession = connectPgSimple(session);

    const app = express();
    app.set('proxy', 1);
    app.use(
        cors({
            origin: function (origin, cb) {
                if (!origin || whitelist.indexOf(origin) !== -1)
                    return cb(null, true);
                cb(new Error('Not allowed by CORS'));
            },
            credentials: true,
        }),
    );

    app.use(
        session({
            name: COOKIE_NAME,
            store: new pgSession({
                conObject: {
                    host: 'localhost',
                    port: 5432,
                    user: POSTGRES_USERNAME,
                    password: POSTGRES_PASSWORD,
                    database: 'handyman',
                },
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true,
                secure: __prod__,
                sameSite: 'lax',
                domain: __prod__ ? '.ohohoh.ca' : undefined,
            },
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET as string,
            resave: false,
            proxy: true,
        }),
    );

    app.get('/', (_, res) => {
        res.send(' OHOHOHOHOHOHOH ');
    });

    app.get('/privacy', (_, res) => {
        res.send(
            'This is a private API made by and for Tim Robilard. Access at your own risk',
        );
    });

    app.get('/terms', (_, res) => {
        res.send(
            'This is a private API made by and for Tim Robilard. Access at your own risk',
        );
    });

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [QuoteResolver, UserResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({
            req,
            res,
        }),
    });

    apolloServer.applyMiddleware({ app, cors: false });

    const PORT = parseInt(process.env.PORT || '3000');

    app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
};

main().catch(err => console.log(err));
