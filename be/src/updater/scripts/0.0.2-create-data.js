"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../logger");
exports.update = (conn) => {
    logger_1.i(`Inside ${__filename}, running update`);
    conn.end();
};
