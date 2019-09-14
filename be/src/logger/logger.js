"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
exports.i = (msg, ...e) => {
    console.log(`[${moment_1.default().format('MM-DD-YYYY hh:mm:ss a')}] - INFO - ${msg}`, ...e);
};
exports.e = (msg, ...e) => {
    console.error(`[${moment_1.default().format('MM-DD-YYYY hh:mm:ss a')}] - ERROR - ${msg}`, ...e);
};
