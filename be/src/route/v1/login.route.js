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
const loginHttpAction = [
    [
        express_validator_1.check('username').isLength({ min: 1 }),
        express_validator_1.check('password').isLength({ min: 1 })
    ],
    common_middleware_1.validateMiddlewareFn,
    (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const username = req.body.username;
        const password = req.body.password;
        // jwt.sign({});
    })
];
const reg = (router) => {
    router.post('/login', ...loginHttpAction);
};
exports.default = reg;
