"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const formidable = __importStar(require("formidable"));
const self_register_route_1 = __importDefault(require("./self-register.route"));
const create_invitation_route_1 = __importDefault(require("./create-invitation.route"));
const v1AppRouter = express_1.default.Router();
v1AppRouter.get('/', (req, res, next) => {
    res.send('test ok');
});
v1AppRouter.post('/p', (req, res, next) => {
    new formidable.IncomingForm().parse(req, (error, fields, files) => {
    });
});
self_register_route_1.default(v1AppRouter);
create_invitation_route_1.default(v1AppRouter);
exports.default = v1AppRouter;
