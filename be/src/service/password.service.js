"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const sha256_1 = __importDefault(require("sha256"));
exports.hashedPassword = (passwd) => {
    const salt = config_1.default.salt;
    return sha256_1.default.x2(`${salt}${passwd}`);
};
