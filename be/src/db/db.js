"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mariadb = __importStar(require("mariadb"));
const config_1 = __importDefault(require("../config"));
const poolConfig = {
    host: config_1.default["db-host"],
    user: config_1.default["db-user"],
    port: config_1.default["db-port"],
    password: config_1.default["db-password"],
    database: config_1.default["db-database"],
    connectionLimit: config_1.default["db-connection-limit"],
};
exports.dbPool = mariadb.createPool(poolConfig);
exports.doInDbConnection = (callback) => __awaiter(this, void 0, void 0, function* () {
    const conn = yield exports.dbPool.getConnection();
    try {
        yield conn.beginTransaction();
        const r = callback(conn);
        yield conn.commit();
        return r;
    }
    catch (e) {
        yield conn.rollback();
        throw e;
    }
    finally {
        yield conn.end();
    }
});
(() => __awaiter(this, void 0, void 0, function* () {
    const r = yield exports.doInDbConnection((conn) => {
        return 'test';
    });
}))();
