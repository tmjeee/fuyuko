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
const logger_1 = require("../../logger");
exports.validateMiddlewareFn = (req, res, next) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
    }
    else {
        next();
    }
};
exports.catchErrorMiddlewareFn = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        console.log('before &&&&&&&&&&&&&&&&&&&&&&&& ');
        yield next();
        console.log('after &&&&&&&&&&&&&&&&&&&&&&&& ');
    }
    catch (err) {
        logger_1.e('Unexpected Error', err);
        res.status(500).json({
            errors: [
                {
                    value: "",
                    msg: `Unexpected Error: ${err.toString()}`,
                    param: "",
                    location: "system"
                }
            ]
        });
    }
});
