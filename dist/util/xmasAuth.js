"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmasAuth = void 0;
const xmasAuth = ({ context: { req } }, next) => {
    console.log('URL: ', req.baseUrl);
    return next();
};
exports.xmasAuth = xmasAuth;
//# sourceMappingURL=xmasAuth.js.map