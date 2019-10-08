
import {doInDbConnection, dbPool, QueryResponse, QueryRows, QueryRow} from "../db";
import {PoolConfig, PoolConnection} from "mariadb";
import path from 'path';
import fs from 'fs';
import util from 'util';
import semver from 'semver';
import {i, e} from '../logger';

export const runUpdate = async () => {

    const updaterEntries: QueryRows = await doInDbConnection<void>(async (conn: PoolConnection) => {
        const r1: QueryResponse = await conn.query(`
            CREATE TABLE IF NOT EXISTS TBL_UPDATER (
              ID INT PRIMARY KEY AUTO_INCREMENT,
              NAME VARCHAR(500) NOT NULL,
              CREATION_DATE TIMESTAMP NOT NULL 
            );
        `);

        const r2: QueryRows = await conn.query(
          `SELECT * FROM TBL_UPDATER`
        );
        return r2;
    });
    const updaterEntryNames: string[] = updaterEntries.map((r: QueryRow) => r.NAME);

    const scriptsDir: string = (path.join(__dirname, 'scripts'));
    const scriptsInScriptsDir: string[] = await util.promisify(fs.readdir)(scriptsDir);
    const orderedScripts: string[] = scriptsInScriptsDir
        .filter((f:string) => f.endsWith('.js'))
        .sort((f1: string, f2: string) => semver.compare(f1, f2))
    for (const script of orderedScripts) {
        const scriptFileFullPath: string = (path.join(scriptsDir, script));
        const s = await import(scriptFileFullPath);
        const hasBeenUpdated = updaterEntryNames.includes(script);
        if (hasBeenUpdated) {
            i(`script ${scriptFileFullPath} has already been executed before, skip excution`);
        }
        else if (!s || !s.update) {
            e(`${scriptFileFullPath} does not have the required update function`);
        }
        else if (s && s.update && !hasBeenUpdated) {
            i(`perform update on script ${scriptFileFullPath}`);
            try {
                await s.update();
                await doInDbConnection((conn: PoolConnection) => {
                    conn.query(`
                    INSERT INTO TBL_UPDATER (NAME) VALUES (?)
                `, [script]);
                });
            } catch(e) {
                e(`Error executing script ${scriptFileFullPath}`, e);
            }
        }
    }
};

runUpdate();
