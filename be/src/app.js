"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const v1_app_router_1 = __importDefault(require("./v1-app-router"));
const cors_1 = __importDefault(require("cors"));
const port = 8888;
const app = express_1.default();
app.use(express_1.default.urlencoded());
app.use(express_1.default.json());
app.use(cookie_parser_1.default());
app.all('*', cors_1.default());
app.use('/v1', v1_app_router_1.default);
app.listen(port, () => console.log(`started at port ${port}`));
