
import {doInDbConnection, QueryResponse, QueryI, QueryA } from "../db";
import {Connection} from "mariadb";
import path from 'path';
import fs from 'fs';
import util from 'util';
import * as semver from 'semver';
import {i, e, w} from '../logger';
import config from '../config';


export type UpdaterProfile = "CORE" | "TEST-DATA"
export const UPDATER_PROFILE_CORE = "CORE";
export const UPDATER_PROFILE_TEST_DATA = "TEST-DATA";


export const isProfile = (profile: UpdaterProfile): boolean => {
    const updaterProfiles: UpdaterProfile[] = config['updater-profiles'];
    if (updaterProfiles.includes(profile)) {
        return true;
    }
    return false;
};

export interface UpdateScript {
    update: () => void;
    profiles: UpdaterProfile[];
}

export const runUpdater = async () => {
    const runUpdater: boolean = config['updater-run'];
    if (runUpdater) {
        i(`** Running updater, profiles found [${(config['updater-profiles'] as UpdaterProfile[]).join(', ')}]`);
        await runUpdate();
    } else {
        i(`** Not running updater`);
    }
}


export const runUpdate = async () => {

    const updaterEntries: QueryA = await doInDbConnection<void>(async (conn: Connection) => {
        const r1: QueryResponse = await conn.query(`
            CREATE TABLE IF NOT EXISTS TBL_UPDATER (
              ID INT PRIMARY KEY AUTO_INCREMENT,
              NAME VARCHAR(500) NOT NULL,
              CREATION_DATE TIMESTAMP NOT NULL 
            );
        `);

        const r2: QueryA = await conn.query(
          `SELECT * FROM TBL_UPDATER`
        );
        return r2;
    });
    const updaterEntryNames: string[] = updaterEntries.map((r: QueryI) => r.NAME);

    const updaterProfiles: UpdaterProfile[] = config['updater-profiles'];
    const scriptsDir: string = (path.join(__dirname, 'scripts'));
    const scriptsInScriptsDir: string[] = await util.promisify(fs.readdir)(scriptsDir);
    const orderedScripts: string[] = scriptsInScriptsDir
        .filter((f:string) => f.endsWith('.js'))
        .sort((f1: string, f2: string) => semver.compare(f1, f2))
    for (const script of orderedScripts) {
        const scriptFileFullPath: string = (path.join(scriptsDir, script));
        const s: UpdateScript = await import(scriptFileFullPath);
        const hasBeenUpdated = updaterEntryNames.includes(script);

        // make sure script exists
        if (!s) {
            i(`script ${scriptFileFullPath} failed to be imported, skip execution`);
            continue;
        }

        // make sure script has not yet being executed before
        if (hasBeenUpdated) {
            i(`script ${scriptFileFullPath} has already been executed before, skip execution`);
            continue;
        }

        if (!s.profiles) {
            w(`${scriptFileFullPath} does not have profile property, will run script`);
        } else {
            let scriptHasProfile: boolean = false;
            const scriptProfiles: UpdaterProfile[] = s.profiles;
            for (const scriptProfile of scriptProfiles) {
                if (isProfile(scriptProfile)) {
                    scriptHasProfile = true;
                    break;
                }
            }
            if (!scriptHasProfile) {
                i(`script ${scriptFileFullPath} profiles [${scriptProfiles.join(', ')}] does not match updater's profiles [${updaterProfiles.join(', ')}], skip execution`);
                continue;
            } else {
                i(`script ${scriptFileFullPath} profiles [${scriptProfiles.join(', ')}] match updater's profiles [${updaterProfiles.join(', ')}], attempt execution`);
            }
        }

        if (!s.update) {
            e(`${scriptFileFullPath} does not have the required update function, skip execution`);
            continue;
        }

        if (s && s.update && !hasBeenUpdated) {
            i(`perform execution on script ${scriptFileFullPath}, run update() function`);
            try {
                await s.update();
                await doInDbConnection((conn: Connection) => {
                    conn.query(`
                    INSERT INTO TBL_UPDATER (NAME) VALUES (?)
                `, [script]);
                });
            } catch(err) {
                e(`Error executing script ${scriptFileFullPath}`, err);
            }
        }
    }
};

