"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../logger");
const db_1 = require("../../db");
const sha256_1 = __importDefault(require("sha256"));
const config_1 = __importDefault(require("../../config"));
exports.update = () => {
    logger_1.i(`Inside ${__filename}, running update`);
    db_1.doInDbConnection((conn) => __awaiter(this, void 0, void 0, function* () {
        // users
        const u1 = yield conn.query(`INSERT INTO TBL_USER (USERNAME, CREATION_DATE, LAST_UPDATE, EMAIL, ENABLED, PASSWORD) VALUES (?, ?, ?, ?, ?, ?)`, ['tmjee', new Date(), new Date(), 'tmjee1@gmail.com', true, passwd('tmjee')]);
        const u2 = yield conn.query(`INSERT INTO TBL_USER (USERNAME, CREATION_DATE, LAST_UPDATE, EMAIL, ENABLED, PASSWORD) VALUES (?, ?, ?, ?, ?, ?)`, ['sxjee', new Date(), new Date(), 'sxjee@gmail.com', true, passwd('sxjee')]);
        // groups
        const g1 = yield conn.query('INSERT INTO TBL_GROUP (NAME, DESCRIPTION) VALUES (?, ?)', ['group 1', 'This is group 1']);
        const g2 = yield conn.query('INSERT INTO TBL_GROUP (NAME, DESCRIPTION) VALUES (?, ?)', ['group 2', 'This is group 2']);
        const g3 = yield conn.query('INSERT INTO TBL_GROUP (NAME, DESCRIPTION) VALUES (?, ?)', ['group 3', 'This is group 3']);
        const g4 = yield conn.query('INSERT INTO TBL_GROUP (NAME, DESCRIPTION) VALUES (?, ?)', ['group 4', 'This is group 4']);
        // user-groups
        conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [u1.insertId, g1.insertId]);
        conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [u1.insertId, g2.insertId]);
        conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [u2.insertId, g3.insertId]);
        conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [u2.insertId, g4.insertId]);
    }));
};
const passwd = (passwd) => {
    const salt = config_1.default.salt;
    return sha256_1.default.x2(`${salt}${passwd}`);
};
