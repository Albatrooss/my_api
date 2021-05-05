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
const constants_1 = require("./util/constants");
const Quote_1 = require("./entities/Quote");
const User_1 = require("./entities/User");
const QuoteResolver_1 = require("./resolvers/QuoteResolver");
const User_2 = require("./resolvers/User");
const connect_pg_simple_1 = __importDefault(require("connect-pg-simple"));
const { WHITELIST_STR, POSTGRES_PASSWORD, POSTGRES_USERNAME } = process.env;
const whitelist = WHITELIST_STR ? WHITELIST_STR.split(',') : [];
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    let retries = 5;
    while (retries) {
        try {
            yield typeorm_1.createConnection({
                type: 'postgres',
                host: constants_1.__prod__ ? 'db' : 'localhost',
                database: 'handyman',
                username: POSTGRES_USERNAME,
                password: POSTGRES_PASSWORD,
                logging: true,
                synchronize: true,
                entities: [Quote_1.Quote, User_1.User],
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
    const pgSession = connect_pg_simple_1.default(express_session_1.default);
    const app = express_1.default();
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
        store: new pgSession({
            conObject: {
                host: constants_1.__prod__ ? 'db' : 'localhost',
                port: 5432,
                user: POSTGRES_USERNAME,
                password: POSTGRES_PASSWORD,
                database: 'handyman',
            },
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
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [QuoteResolver_1.QuoteResolver, User_2.UserResolver],
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