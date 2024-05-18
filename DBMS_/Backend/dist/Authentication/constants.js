"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConstants = void 0;
const crypto = require('crypto');
const generateSecret = () => {
    return crypto.randomBytes(32).toString('hex');
};
exports.jwtConstants = {
    secret: generateSecret(),
};
//# sourceMappingURL=constants.js.map