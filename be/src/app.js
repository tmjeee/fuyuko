"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const v1_app_router_1 = __importDefault(require("./route/v1/v1-app-router"));
const cors_1 = __importDefault(require("cors"));
const logger_1 = require("./logger");
const updater_1 = require("./updater");
const banner_1 = require("./banner");
const config_1 = __importDefault(require("./config"));
banner_1.runBanner();
const port = Number(config_1.default.port);
const app = express_1.default();
app.use(express_1.default.urlencoded());
app.use(express_1.default.json());
app.use(cookie_parser_1.default());
app.all('*', cors_1.default());
app.use('/v1', v1_app_router_1.default);
logger_1.i(`running db update`);
updater_1.runUpdate()
    .then((r) => {
    logger_1.i(`done db update`);
});
app.listen(port, () => logger_1.i(`started at port ${port}`));
