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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, GOOGLE_REFRESH_TOKEN, FROM_EMAIL, TO_EMAIL, } = process.env;
const oAuth2Client = new googleapis_1.google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);
oAuth2Client.setCredentials({
    refresh_token: GOOGLE_REFRESH_TOKEN,
});
const sendEmail = (mailData) => __awaiter(void 0, void 0, void 0, function* () {
    return true;
    try {
        const accessToken = yield oAuth2Client.getAccessToken();
        const transport = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                type: 'oAuth2',
                user: FROM_EMAIL,
                clientId: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                refreshToken: GOOGLE_REFRESH_TOKEN,
                accessToken,
            },
        });
        const mailOptions = Object.assign({ from: FROM_EMAIL, to: TO_EMAIL }, mailData);
        yield transport.sendMail(mailOptions);
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
});
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendEmail.js.map