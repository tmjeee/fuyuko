"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const common_middleware_1 = require("./common-middleware");
const activateHttpAction = [
    [
        express_validator_1.check('code').isLength({ min: 1 })
    ],
    common_middleware_1.validateMiddlewareFn,
    (req, res, next) => {
        const code = req.params['code'];
        res.json();
    }
];
const reg = (router) => {
    router.get('/activate-invitation/:code', ...activateHttpAction);
};
