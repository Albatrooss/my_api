"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMd = void 0;
const AuthMd = service => ({ context: { req } }, next) => {
    const from = req.headers['ohohoh-from'];
    console.log('from', from);
    if (!from || from !== service)
        throw new Error('access denied');
    return next();
};
exports.AuthMd = AuthMd;
//# sourceMappingURL=AuthMd.js.map