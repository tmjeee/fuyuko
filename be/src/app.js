"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var port = 8888;
var app = express_1.default();
app.get('/', function (req, res, next) {
    res.send('test');
});
app.listen(port, function () { return console.log("started at port " + port); });
