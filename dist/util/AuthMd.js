"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMd = void 0;
const AuthMd = service => ({ context: { req } }, next) => {
    console.log('host', req.hostname);
    if (req.hostname !== process.env[`SERVICE_${service}`])
        throw new Error('access denied');
    return next();
};
exports.AuthMd = AuthMd;
//# sourceMappingURL=AuthMd.js.map