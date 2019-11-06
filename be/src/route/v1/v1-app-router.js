"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const formidable_1 = __importDefault(require("formidable"));
const v1AppRouter = express_1.default.Router();
v1AppRouter.get('/', (req, res, next) => {
    res.send('test ok');
});
v1AppRouter.post('/p', (req, res, next) => {
    new formidable_1.default.IncomingForm().parse(req, (error, fields, files) => {
    });
});
exports.default = v1AppRouter;
