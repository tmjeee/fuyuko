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
const express_validator_1 = require("express-validator");
const common_middleware_1 = require("./common-middleware");
<<<<<<< HEAD
=======
const db_1 = require("../../db");
const service_1 = require("../../service");
>>>>>>> 8f4582cadd994e95d581111a2d055da51e4dfa19
const loginHttpAction = [
    [
        express_validator_1.check('username').isLength({ min: 1 }),
        express_validator_1.check('password').isLength({ min: 1 })
    ],
    common_middleware_1.validateMiddlewareFn,
    (req, res, next) => __awaiter(this, void 0, void 0, function* () {
<<<<<<< HEAD
        const username = req.body.username;
        const password = req.body.password;
        // jwt.sign({});
=======
        const usrname = req.body.username;
        const password = service_1.hashedPassword(req.body.password);
        yield db_1.doInDbConnection((conn) => __awaiter(this, void 0, void 0, function* () {
            const qUser = yield conn.query(`
                SELECT 
                    U.ID AS ID, 
                    U.USERNAME AS USERNAME, 
                    U.CREATION_DATE AS CREATION_DATE, 
                    U.LAST_UPDATE AS LAST_UPDATE, 
                    U.EMAIL AS EMAIL, 
                    U.FIRSTNAME AS FIRSTNAME, 
                    U.LASTNAME AS LASTNAME, 
                    U.ENABLED AS ENABLED, 
                    U.PASSWORD AS PASSWORD,
                    T.THEME AS THEME,
                    A.ID AS AVATAR_ID
                FROM TBL_USER AS U
                LEFT JOIN TBL_THEME AS T ON T.USER_ID = U.ID 
                LEFT JOIN TBL_USER_AVATAR AS A ON A.USER_ID = U.ID
                WHERE U.USERNAME = ? AND U.PASSWORD = ? AND STATUS= = ?
            `, [usrname, password, 'ENABLED']);
            if (qUser.length <= 0) { // no user found
                // todo: switch to error object
                res.status(401).json({});
            }
            const theme = qUser[0].THEME;
            const userId = qUser[0].ID;
            const username = qUser[0].USERNAME;
            const firstName = qUser[0].FIRSTNAME;
            const lastName = qUser[0].LASTNAME;
            const email = qUser[0].EMAIL;
            const qGroup = yield conn.query(`
                SELECT
                    G.ID AS G_ID,
                    G.NAME AS G_NAME,
                    G.DESCRIPTION AS G_DESCRIPTION,
                    G.STATUS AS G_STATUS,
                    R.ID AS R_ID,
                    R.NAME AS R_NAME,
                    R.DESCRIPTION AS R_DESCRIPTION
                FROM TBL_GROUP AS G
                LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS LGR ON LGR.GROUP_ID = G.ID
                LEFT JOIN TBL_ROLE AS R ON R.ID = LGR.ROLE_ID
                LEFT JOIN TBL_LOOKUP_USER_GROUP AS LUG ON LUG.GROUP_ID = G.ID
                WHERE LUG.USER_ID = ? AND G.STATUS = ?
            `, [userId, 'ENABLED']);
            const groups = [...qGroup.reduce((acc, g) => {
                    if (!acc.has(g.G_ID)) {
                        acc.set(g.G_ID, {
                            id: g.G_ID,
                            name: g.G_NAME,
                            description: g.G_DESCRIPTION,
                            status: g.G_STATUS,
                            roles: []
                        });
                    }
                    const group = acc.get(g.G_ID);
                    group.roles.push(g.R_NAME);
                    return acc;
                }, new Map()).values()];
            const user = {
                id: userId,
                username: username,
                firstName: firstName,
                lastName: lastName,
                theme,
                email,
                groups
            };
            const jwtToken = service_1.createJwtToken(user);
            res.status(200).json({
                jwtToken,
                status: 'SUCCESS',
                message: `Successfully logged in`,
                user
            });
        }));
>>>>>>> 8f4582cadd994e95d581111a2d055da51e4dfa19
    })
];
const reg = (router) => {
    router.post('/login', ...loginHttpAction);
};
exports.default = reg;
