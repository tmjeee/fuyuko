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
const check_1 = require("express-validator/check");
const db_1 = require("../../db");
const common_middleware_1 = require("./common-middleware");
const selfRegister = (username, email, password) => __awaiter(this, void 0, void 0, function* () {
    const reg = yield db_1.doInDbConnection((conn) => __awaiter(this, void 0, void 0, function* () {
        const q1 = yield conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_SELF_REGISTRATION WHERE USERNAME = ? OR EMAIL = ?`, [username, email]);
        const q2 = yield conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_USER WHERE USERNAME = ? OR EMAIL = ?`, [username, email]);
        if (!!q1[0].COUNT || !!q2[0].COUNT) {
            return { registrationId: null, email, username, status: 'ERROR', message: `Username ${username} or ${email} is already taken` };
        }
        const r = yield conn.query(`
                INSERT INTO TBL_SELF_REGISTRATION (USERNAME, EMAIL, CREATION_DATE, ACTIVATED)
                VALUES (?, ?, ?, ?);
            `, [username, email, new Date(), false]);
        if (r.affectedRows > 0) {
            return { registrationId: r.insertId, email, username, status: 'SUCCESS', message: `User ${username} (${email}) registered` };
        }
        return { registrationId: null, email, username, status: 'ERROR', message: `Unable to insert into DB ( Username ${username} or ${email} )` };
    }));
    return reg;
});
const selfRegisterHttpAction = [
    common_middleware_1.catchErrorMiddlewareFn,
    [
        check_1.check('username').isLength({ min: 1 }),
        check_1.check('email').isLength({ min: 1 }).isEmail(),
        check_1.check('password').isLength({ min: 1 })
    ],
    common_middleware_1.validateMiddlewareFn,
    (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const r = yield selfRegister(username, email, password);
        res.status(200).json(r);
    })
];
const reg = (router) => {
    router.post('/self-register', ...selfRegisterHttpAction);
};
exports.default = reg;
