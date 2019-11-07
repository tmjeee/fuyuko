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
const db_1 = require("../../db");
const v1_1 = __importDefault(require("uuid/v1"));
exports.register = (username, email, password) => __awaiter(this, void 0, void 0, function* () {
    const reg = yield db_1.doInDbConnection((conn) => __awaiter(this, void 0, void 0, function* () {
        const q1 = yield conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_REGISTRATION WHERE USERNAME = ? OR EMAIL = ?`, [username, email]);
        const q2 = yield conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_USER WHERE USERNAME = ? OR EMAIL = ?`, [username, email]);
        if (!!q1[0].COUNT || !!q2[0].COUNT) {
            return { registrationId: null, email, username, status: 'ERROR', message: `Username ${username} or ${email} is already taken` };
        }
        const r = yield conn.query(`
                INSERT INTO TBL_REGISTRATION (USERNAME, EMAIL, CREATION_DATE, TYPE, CODE, ACTIVATED)
                VALUES (?, ?, ?, ?, ?, ?);
            `, [username, email, new Date(), 'self', v1_1.default(), 0]);
        if (r.affectedRows > 0) {
            return { registrationId: r.insertId, email, username, status: 'SUCCESS', message: `User ${username} (${email}) registered` };
        }
        return { registrationId: null, email, username, status: 'ERROR', message: `Unable to insert into DB ( Username ${username} or ${email} )` };
    }));
    return reg;
});
