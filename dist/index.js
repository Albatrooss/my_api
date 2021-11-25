"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv-safe/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const typeorm_1 = require("typeorm");
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const ioredis_1 = __importDefault(require("ioredis"));
const constants_1 = require("./util/constants");
const Quote_1 = require("./entities/Quote");
const User_1 = require("./entities/User");
const QuoteResolver_1 = require("./resolvers/QuoteResolver");
const User_2 = require("./resolvers/User");
const Xmas_1 = require("./entities/Xmas");
const Xmas_2 = require("./resolvers/Xmas");
const { WHITELIST_STR, POSTGRES_PASSWORD, POSTGRES_USERNAME, POSTGRES_PORT } = process.env;
const whitelist = WHITELIST_STR ? WHITELIST_STR.split(',') : [];
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    let retries = 5;
    while (retries) {
        try {
            yield typeorm_1.createConnection({
                type: 'postgres',
                host: 'localhost',
                database: 'handyman',
                port: Number(POSTGRES_PORT),
                username: POSTGRES_USERNAME,
                password: POSTGRES_PASSWORD,
                logging: true,
                synchronize: true,
                entities: [Quote_1.Quote, User_1.User, Xmas_1.Xmas],
            });
            break;
        }
        catch (error) {
            console.log(error);
            retries--;
            console.log(`retries left: ${retries}`);
            yield new Promise(res => setTimeout(res, 5000));
        }
    }
    const app = express_1.default();
    const RedisStore = connect_redis_1.default(express_session_1.default);
    const redis = new ioredis_1.default({
        host: 'localhost',
        password: process.env.REDIS_PWD,
    });
    app.set('proxy', 1);
    app.use(cors_1.default({
        origin: function (origin, cb) {
            if (!origin || whitelist.indexOf(origin) !== -1)
                return cb(null, true);
            cb(new Error('Not allowed by CORS'));
        },
        credentials: true,
    }));
    app.use(express_session_1.default({
        name: constants_1.COOKIE_NAME,
        store: new RedisStore({
            client: redis,
            disableTouch: true
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            httpOnly: true,
            secure: constants_1.__prod__,
            sameSite: 'lax',
            domain: constants_1.__prod__ ? '.ohohoh.ca' : undefined,
        },
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        resave: false,
        proxy: true,
    }));
    app.get('/', (_, res) => {
        res.send(' OHOHOHOHOHOHOH ');
    });
    app.get('/privacy', (_, res) => {
        res.send('This is a private API made by and for Tim Robilard. Access at your own risk');
    });
    app.get('/terms', (_, res) => {
        res.send('This is a private API made by and for Tim Robilard. Access at your own risk');
    });
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [QuoteResolver_1.QuoteResolver, User_2.UserResolver, Xmas_2.XmasResolver],
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
});
main().catch(err => console.log(err));
//# sourceMappingURL=index.js.map