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
exports.QuoteResolver = exports.FieldError = exports.QuoteInput = void 0;
const Quote_1 = require("../entities/Quote");
const type_graphql_1 = require("type-graphql");
const sendEmail_1 = require("../util/sendEmail");
const createEmailData_1 = require("../util/createEmailData");
const constants_1 = require("../util/constants");
let QuoteInput = class QuoteInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], QuoteInput.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], QuoteInput.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], QuoteInput.prototype, "phoneNumber", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], QuoteInput.prototype, "description", void 0);
QuoteInput = __decorate([
    type_graphql_1.ObjectType(),
    type_graphql_1.InputType()
], QuoteInput);
exports.QuoteInput = QuoteInput;
let FieldError = class FieldError {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    type_graphql_1.ObjectType()
], FieldError);
exports.FieldError = FieldError;
let QuoteResponse = class QuoteResponse {
};
__decorate([
    type_graphql_1.Field(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], QuoteResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => Quote_1.Quote, { nullable: true }),
    __metadata("design:type", Quote_1.Quote)
], QuoteResponse.prototype, "quote", void 0);
QuoteResponse = __decorate([
    type_graphql_1.ObjectType()
], QuoteResponse);
let QuoteResolver = class QuoteResolver {
    statusStr(root) {
        return constants_1.statusStr[root.status];
    }
    quotes() {
        return Quote_1.Quote.find({ order: { id: 'DESC' } });
    }
    createQuote(input) {
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
            if (!input.phoneNumber && !input.email) {
                return {
                    errors: [
                        {
                            field: 'phoneNumber',
                            message: 'We need a way to reach you!',
                        },
                    ],
                };
            }
            const quote = Quote_1.Quote.create(Object.assign({}, input));
            const emailSent = yield sendEmail_1.sendEmail(createEmailData_1.createEmailData(input));
            console.log('email ?', emailSent);
            if (emailSent) {
                const newQuote = yield quote.save();
                return {
                    quote: newQuote,
                };
            }
            return {
                errors: [
                    {
                        field: 'email',
                        message: 'Quote not saved, please try again. If the issue persists please give us a call at 123-456-7890',
                    },
                ],
            };
        });
    }
    updateQuoteStatus(status, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (status > 4)
                false;
            const updatedQuote = yield Quote_1.Quote.update({ id }, { status });
            if (updatedQuote.affected !== 1)
                return false;
            return true;
        });
    }
    deleteQuote(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Quote_1.Quote.delete({ id });
            return true;
        });
    }
};
__decorate([
    type_graphql_1.FieldResolver(),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Quote_1.Quote]),
    __metadata("design:returntype", String)
], QuoteResolver.prototype, "statusStr", null);
__decorate([
    type_graphql_1.Query(() => [Quote_1.Quote]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuoteResolver.prototype, "quotes", null);
__decorate([
    type_graphql_1.Mutation(() => QuoteResponse),
    __param(0, type_graphql_1.Arg('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QuoteInput]),
    __metadata("design:returntype", Promise)
], QuoteResolver.prototype, "createQuote", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg('status', () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], QuoteResolver.prototype, "updateQuoteStatus", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], QuoteResolver.prototype, "deleteQuote", null);
QuoteResolver = __decorate([
    type_graphql_1.Resolver(Quote_1.Quote)
], QuoteResolver);
exports.QuoteResolver = QuoteResolver;
//# sourceMappingURL=QuoteResolver.js.map