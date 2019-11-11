"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../logger");
const db_1 = require("../../db");
const service_1 = require("../../service");
exports.update = () => {
    logger_1.i(`Inside ${__filename}, running update`);
    db_1.doInDbConnection((conn) => __awaiter(this, void 0, void 0, function* () {
        // users
        const u1 = yield conn.query(`INSERT INTO TBL_USER (USERNAME, CREATION_DATE, LAST_UPDATE, EMAIL, STATUS, PASSWORD) VALUES (?, ?, ?, ?, ?, ?)`, ['tmjee', new Date(), new Date(), 'tmjee1@gmail.com', 'ENABLED', service_1.hashedPassword('tmjee')]);
        const u2 = yield conn.query(`INSERT INTO TBL_USER (USERNAME, CREATION_DATE, LAST_UPDATE, EMAIL, STATUS, PASSWORD) VALUES (?, ?, ?, ?, ?, ?)`, ['sxjee', new Date(), new Date(), 'sxjee@gmail.com', 'ENABLED', service_1.hashedPassword('sxjee')]);
        // groups
        const g1 = yield conn.query('INSERT INTO TBL_GROUP (NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?)', ['group 1', 'This is group 1', 'ENABLED']);
        const g2 = yield conn.query('INSERT INTO TBL_GROUP (NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?)', ['group 2', 'This is group 2', 'ENABLED']);
        const g3 = yield conn.query('INSERT INTO TBL_GROUP (NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?)', ['group 3', 'This is group 3', 'ENABLED']);
        const g4 = yield conn.query('INSERT INTO TBL_GROUP (NAME, DESCRIPTION, STATUS) VALUES (?, ?, ?)', ['group 4', 'This is group 4', 'ENABLED']);
        // user-groups
        conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [u1.insertId, g1.insertId]);
        conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [u1.insertId, g2.insertId]);
        conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [u2.insertId, g3.insertId]);
        conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [u2.insertId, g4.insertId]);
    }));
};
