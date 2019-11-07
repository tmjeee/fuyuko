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
const register_service_1 = require("../../service/register-service");
const common_middleware_1 = require("./common-middleware");
const testHttpAction = (req, res, next) => {
    console.log('**************** get test');
    res.json('{}');
};
const registerHttpAction = [
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
        const r = yield register_service_1.register(username, email, password);
        res.status(200).json(r);
    })
];
const reg = (router) => {
    router.get('/test', testHttpAction);
    router.post('/register', ...registerHttpAction);
};
exports.default = reg;
