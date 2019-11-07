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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const semver = __importStar(require("semver"));
const logger_1 = require("../logger");
exports.runUpdate = () => __awaiter(this, void 0, void 0, function* () {
    const updaterEntries = yield db_1.doInDbConnection((conn) => __awaiter(this, void 0, void 0, function* () {
        const r1 = yield conn.query(`
            CREATE TABLE IF NOT EXISTS TBL_UPDATER (
              ID INT PRIMARY KEY AUTO_INCREMENT,
              NAME VARCHAR(500) NOT NULL,
              CREATION_DATE TIMESTAMP NOT NULL 
            );
        `);
        const r2 = yield conn.query(`SELECT * FROM TBL_UPDATER`);
        return r2;
    }));
    const updaterEntryNames = updaterEntries.map((r) => r.NAME);
    const scriptsDir = (path_1.default.join(__dirname, 'scripts'));
    const scriptsInScriptsDir = yield util_1.default.promisify(fs_1.default.readdir)(scriptsDir);
    const orderedScripts = scriptsInScriptsDir
        .filter((f) => f.endsWith('.js'))
        .sort((f1, f2) => semver.compare(f1, f2));
    for (const script of orderedScripts) {
        const scriptFileFullPath = (path_1.default.join(scriptsDir, script));
        const s = yield Promise.resolve().then(() => __importStar(require(scriptFileFullPath)));
        const hasBeenUpdated = updaterEntryNames.includes(script);
        if (hasBeenUpdated) {
            logger_1.i(`script ${scriptFileFullPath} has already been executed before, skip excution`);
        }
        else if (!s || !s.update) {
            logger_1.e(`${scriptFileFullPath} does not have the required update function`);
        }
        else if (s && s.update && !hasBeenUpdated) {
            logger_1.i(`perform update on script ${scriptFileFullPath}`);
            try {
                yield s.update();
                yield db_1.doInDbConnection((conn) => {
                    conn.query(`
                    INSERT INTO TBL_UPDATER (NAME) VALUES (?)
                `, [script]);
                });
            }
            catch (e) {
                e(`Error executing script ${scriptFileFullPath}`, e);
            }
        }
    }
});
