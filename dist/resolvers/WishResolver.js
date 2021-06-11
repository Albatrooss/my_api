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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishResolver = exports.WishInput = void 0;
const Wish_1 = require("../entities/Wish");
const type_graphql_1 = require("type-graphql");
const QuoteResolver_1 = require("./QuoteResolver");
let WishInput = class WishInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], WishInput.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], WishInput.prototype, "text", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Boolean)
], WishInput.prototype, "like", void 0);
WishInput = __decorate([
    type_graphql_1.ObjectType(),
    type_graphql_1.InputType()
], WishInput);
exports.WishInput = WishInput;
let WishResponse = class WishResponse {
};
__decorate([
    type_graphql_1.Field(() => [QuoteResolver_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], WishResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => Wish_1.Wish, { nullable: true }),
    __metadata("design:type", Wish_1.Wish)
], WishResponse.prototype, "wish", void 0);
WishResponse = __decorate([
    type_graphql_1.ObjectType()
], WishResponse);
let WishResolver = class WishResolver {
    wishes() {
        return Wish_1.Wish.find({ order: { id: 'DESC' } });
    }
    createWish(input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!input.name) {
                return {
                    errors: [
                        {
                            field: 'name',
                            message: 'Name required',
                        },
                    ],
                };
            }
            const tempWish = Wish_1.Wish.create(Object.assign({}, input));
            const wish = yield tempWish.save();
            return {
                wish
            };
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [Wish_1.Wish]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WishResolver.prototype, "wishes", null);
__decorate([
    type_graphql_1.Mutation(() => WishResponse),
    __param(0, type_graphql_1.Arg('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WishInput]),
    __metadata("design:returntype", Promise)
], WishResolver.prototype, "createWish", null);
WishResolver = __decorate([
    type_graphql_1.Resolver(Wish_1.Wish)
], WishResolver);
exports.WishResolver = WishResolver;
//# sourceMappingURL=WishResolver.js.map