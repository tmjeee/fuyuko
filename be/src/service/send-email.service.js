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
const config_1 = __importDefault(require("../config"));
const nodemailer_1 = require("nodemailer");
const logger_1 = require("../logger");
const xoauth2 = require('xoauth2');
exports.sendEmail = (toEmail, subject, text) => __awaiter(this, void 0, void 0, function* () {
    // kdyvfchvtpkospng
    const transporter = nodemailer_1.createTransport({
        host: config_1.default["smtp-host"],
        port: config_1.default["smtp-port"],
        secure: config_1.default["smtp-secure"],
        auth: {
            user: config_1.default["smtp-user"],
            pass: config_1.default["smtp-password"]
        }
    });
    const info = yield transporter.sendMail({
        from: config_1.default["smtp-from-email"],
        to: toEmail,
        subject,
        text
    });
    logger_1.i(`Send email `, info);
    return info;
});
