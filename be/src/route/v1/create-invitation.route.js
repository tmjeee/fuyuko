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
const express_validator_1 = require("express-validator");
const common_middleware_1 = require("./common-middleware");
const service_1 = require("../../service");
const db_1 = require("../../db");
const config_1 = __importDefault(require("../../config"));
const uuid = require("uuid");
/**
 * POST   /v1/create-invitation
 *  - email: string
 *  - groupIds: number[]
 *
 * @param email
 */
exports.createInvitation = (email, groupIds = []) => __awaiter(this, void 0, void 0, function* () {
    return yield db_1.doInDbConnection((conn) => __awaiter(this, void 0, void 0, function* () {
        const hasUserQuery = yield conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_USER WHERE EMAIL = ?`, [email]);
        if (hasUserQuery[0].COUNT > 0) {
            return {
                status: 'ERROR',
                message: `Email ${email} has already been registered`
            };
        }
        const hasInvitationQuery = yield conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_INVITATION_REGISTRATION WHERE EMAIL = ?`, [email]);
        if (hasInvitationQuery[0].COUNT > 0) {
            yield conn.query(`DELETE FROM TBL_INVITATION_REGISTRATION WHERE EMAIL = ? `, [email]);
        }
        const code = uuid();
        const q1 = yield conn.query(`INSERT INTO TBL_INVITATION_REGISTRATION (EMAIL, CREATION_DATE, ACTIVATED, CODE) VALUES (?, ?, ?, ?)`, [email, new Date(), false, code]);
        const registrationId = q1.insertId;
        for (const gId of groupIds) {
            yield conn.query(`INSERT INTO TBL_INVITATION_REGISTRATION_GROUP (INVITATION_REGISTRATION_ID, GROUP_ID) VALUES (?, ?)`, [registrationId, gId]);
        }
        const info = yield service_1.sendEmail(email, 'Invitation to join Fukyko MDM', `
                Hello,
                
                You have been invited to join Fuyuko MDM. Please ${config_1.default["fe-url-base"]}/${code} to activate your 
                account.
                
                Enjoy! and welcome aboard.
            `);
    }));
});
const createInvitationHttpAction = [
    [
        express_validator_1.check('email').isLength({ min: 1 }).isEmail(),
    ],
    common_middleware_1.validateMiddlewareFn,
    (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const email = req.body.email;
        const groupIds = req.body.groupIds;
        yield exports.createInvitation(email, groupIds);
        res.status(200).json({
            status: "SUCCESS",
            message: `Invitation Created`
        });
    })
];
const reg = (router) => {
    router.post('/create-invitation', ...createInvitationHttpAction);
};
exports.default = reg;
