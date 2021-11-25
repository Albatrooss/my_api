"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomize = void 0;
const constants_1 = require("./constants");
const randomize = (timesFailed = 0) => {
    if (timesFailed > 100)
        throw new Error('Failed too many times..');
    const results = {};
    const taken = [];
    let failed = false;
    for (const person in constants_1.MEMBERS) {
        let partner = constants_1.MEMBERS[person];
        const possibilites = Object.values(constants_1.MEMBERS).filter(x => x !== person && x !== partner && !taken.includes(x));
        if (possibilites.length < 1) {
            failed = true;
            break;
        }
        let res = possibilites[Math.floor(Math.random() * possibilites.length)];
        results[person] = res;
        taken.push(res);
    }
    if (failed) {
        timesFailed++;
        return exports.randomize(timesFailed);
    }
    return results;
};
exports.randomize = randomize;
//# sourceMappingURL=randomize.js.map