import 'reflect-metadata';
import 'dotenv-safe/config';
import express from 'express';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { QuoteResolver } from './resolvers/QuoteResolver';
import { Quote } from './entities/Quote';

const { WHITELIST_STR, POSTGRES_PASSWORD, POSTGRES_USERNAME } = process.env;
const whitelist = WHITELIST_STR ? WHITELIST_STR.split(',') : [];

const main = async () => {
    console.log('url: ', process.env.DATABASE_URL);
    await createConnection({
        type: 'postgres',
        host: 'db',
        username: POSTGRES_USERNAME,
        password: POSTGRES_PASSWORD,
        logging: true,
        synchronize: true,
        entities: [Quote],
    });

    const app = express();
    // app.set('proxy', 1);
    app.use(
        cors({
            origin: function (origin, cb) {
                if (!origin || whitelist.indexOf(origin) !== -1)
                    return cb(null, true);
                cb(new Error('Not allowed by CORS'));
            },
        }),
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [QuoteResolver],
            validate: false,
        }),
    });

    apolloServer.applyMiddleware({ app, cors: false });

    const PORT = parseInt(process.env.PORT || '3000');

    app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
};

main().catch(err => console.log(err));
