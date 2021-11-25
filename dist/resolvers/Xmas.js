"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.XmasResolver = void 0;
const type_graphql_1 = require("type-graphql");
const QuoteResolver_1 = require("./QuoteResolver");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Xmas_1 = require("../entities/Xmas");
const constants_1 = require("../util/constants");
const typeorm_1 = require("typeorm");
const AuthMd_1 = require("../util/AuthMd");
const randomize_1 = require("../util/randomize");
let XmasResponse = class XmasResponse {
};
__decorate([
    type_graphql_1.Field(() => [QuoteResolver_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], XmasResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => Xmas_1.Xmas, { nullable: true }),
    __metadata("design:type", Xmas_1.Xmas)
], XmasResponse.prototype, "user", void 0);
XmasResponse = __decorate([
    type_graphql_1.ObjectType()
], XmasResponse);
let XmasResolver = class XmasResolver {
    meXmas({ req }) {
        const userId = req.session.xmasId;
        if (!userId)
            return new Promise(res => res(undefined));
        return Xmas_1.Xmas.findOne(userId);
    }
    createXmas(name, password) {
        return __awaiter(this, void 0, void 0, function* () {
            name = name.toLowerCase();
            if (!Object.keys(constants_1.MEMBERS).includes(name))
                return {
                    errors: [{
                            field: 'name',
                            message: 'Must be a Robillard+'
                        }]
                };
            const hashedPassword = yield bcrypt_1.default.hash(password, 6);
            let user;
            try {
                const result = yield typeorm_1.getConnection()
                    .createQueryBuilder()
                    .insert()
                    .into(Xmas_1.Xmas)
                    .values({
                    name,
                    password: hashedPassword
                })
                    .returning('*')
                    .execute();
                user = result.raw[0];
            }
            catch (error) {
                if (error.detail.includes('already exists')) {
                    return {
                        errors: [
                            {
                                field: 'name',
                                message: 'Name taken',
                            },
                        ],
                    };
                }
                return {
                    errors: [
                        {
                            field: 'name',
                            message: error.message,
                        },
                    ],
                };
            }
            return {
                user,
            };
        });
    }
    loginXmas(name, password, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const xmas = yield Xmas_1.Xmas.findOne({ where: { name } });
            if (!xmas) {
                return {
                    errors: [
                        {
                            field: 'name',
                            message: 'Robillards+ Only',
                        },
                    ],
                };
            }
            const valid = yield bcrypt_1.default.compare(password, xmas.password);
            if (!valid) {
                return {
                    errors: [
                        {
                            field: 'password',
                            message: 'Incorrect Password',
                        },
                    ],
                };
            }
            req.session.xmasId = xmas.id;
            return {
                user: xmas,
            };
        });
    }
    logoutXmas({ req, res }) {
        return new Promise((resolve) => req.session.destroy((err) => {
            res.clearCookie(constants_1.COOKIE_NAME);
            if (err) {
                console.log(err);
                resolve(false);
                return;
            }
            resolve(true);
        }));
    }
    randomize() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield Xmas_1.Xmas.find();
            const random = Object.entries(randomize_1.randomize()).map(([name, gift]) => ({
                name,
                giftId: res.find(x => x.name === gift).id,
            }));
            yield Promise.all(random.map(({ name, giftId }) => Xmas_1.Xmas.update({ name }, { giftId })));
            return true;
        });
    }
    gift({ giftId }) {
        return Xmas_1.Xmas.findOne({ where: { id: giftId } });
    }
};
__decorate([
    type_graphql_1.UseMiddleware(AuthMd_1.AuthMd('XMAS')),
    type_graphql_1.Query(() => Xmas_1.Xmas, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], XmasResolver.prototype, "meXmas", null);
__decorate([
    type_graphql_1.UseMiddleware(AuthMd_1.AuthMd('XMAS')),
    type_graphql_1.Mutation(() => XmasResponse),
    __param(0, type_graphql_1.Arg('name')), __param(1, type_graphql_1.Arg('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], XmasResolver.prototype, "createXmas", null);
__decorate([
    type_graphql_1.UseMiddleware(AuthMd_1.AuthMd('XMAS')),
    type_graphql_1.Mutation(() => XmasResponse),
    __param(0, type_graphql_1.Arg('name')),
    __param(1, type_graphql_1.Arg('password')),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], XmasResolver.prototype, "loginXmas", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], XmasResolver.prototype, "logoutXmas", null);
__decorate([
    type_graphql_1.UseMiddleware(AuthMd_1.AuthMd('XMAS')),
    type_graphql_1.Mutation(() => Boolean),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], XmasResolver.prototype, "randomize", null);
__decorate([
    type_graphql_1.FieldResolver(),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Xmas_1.Xmas]),
    __metadata("design:returntype", void 0)
], XmasResolver.prototype, "gift", null);
XmasResolver = __decorate([
    type_graphql_1.Resolver(() => Xmas_1.Xmas)
], XmasResolver);
exports.XmasResolver = XmasResolver;
//# sourceMappingURL=Xmas.js.map