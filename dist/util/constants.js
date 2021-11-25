"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MEMBERS = exports.COOKIE_NAME = exports.__prod__ = exports.statusStr = exports.Q_PAID = exports.Q_WORK_DONE = exports.Q_CONTACTED = exports.Q_VIEWED = exports.Q_NEW = void 0;
exports.Q_NEW = 0;
exports.Q_VIEWED = 1;
exports.Q_CONTACTED = 2;
exports.Q_WORK_DONE = 3;
exports.Q_PAID = 4;
exports.statusStr = ['New', 'Viewed', 'Contacted', 'Work Done', 'Paid'];
exports.__prod__ = process.env.NODE_ENV === 'production';
exports.COOKIE_NAME = 'qid';
exports.MEMBERS = {
    tim: 'caitlin',
    caitlin: 'tim',
    andrew: 'kyla',
    kyla: 'andrew',
    adam: 'hannah',
    hannah: 'adam',
    hugh: 'patti',
    patti: 'hugh'
};
//# sourceMappingURL=constants.js.map