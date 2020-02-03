import {Connection} from "mariadb";
import {i} from '../../logger';
import {doInDbConnection, QueryA, QueryResponse} from '../../db';
import {hashedPassword} from "../../service";
import {GROUP_ADMIN, GROUP_EDIT, GROUP_PARTNER, GROUP_VIEW} from "../../model/group.model";
import {Themes} from "../../model/theme.model";


export const update = async () => {
    i(`running scripts in ${__filename}`);

    await INSERT_DATA();

    i(`done running update on ${__filename}`);
};


const INSERT_DATA = async () => {

    await doInDbConnection(async (conn: Connection) => {
        // users
        const u1: QueryResponse = await conn.query(`INSERT INTO TBL_USER (USERNAME, CREATION_DATE, LAST_UPDATE, EMAIL, STATUS, PASSWORD, FIRSTNAME, LASTNAME) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            ['cypress', new Date(), new Date(), 'tmjeee@gmail.com', 'ENABLED', hashedPassword('test'), 'cypress', 'jee']);
        const u2: QueryResponse = await conn.query(`INSERT INTO TBL_USER (USERNAME, CREATION_DATE, LAST_UPDATE, EMAIL, STATUS, PASSWORD, FIRSTNAME, LASTNAME) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            ['tmjee', new Date(), new Date(), 'tmjee1@gmail.com', 'ENABLED', hashedPassword('test'), 'toby', 'jee']);
        const u3: QueryResponse = await conn.query(`INSERT INTO TBL_USER (USERNAME, CREATION_DATE, LAST_UPDATE, EMAIL, STATUS, PASSWORD, FIRSTNAME, LASTNAME) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            ['sxjee', new Date(), new Date(), 'sxjee@gmail.com', 'ENABLED', hashedPassword('test'), 'song xian', 'jee']);

        // lookup group ids
        const viewGroupId: number = (await conn.query(`SELECT ID FROM TBL_GROUP WHERE NAME=?`, [GROUP_VIEW]) as QueryA)[0].ID;
        const editGroupId: number = (await conn.query(`SELECT ID FROM TBL_GROUP WHERE NAME=?`, [GROUP_EDIT]) as QueryA)[0].ID;
        const adminGroupId: number = (await conn.query(`SELECT ID FROM TBL_GROUP WHERE NAME=?`, [GROUP_ADMIN]) as QueryA)[0].ID;
        const partnerGroupId: number = (await conn.query(`SELECT ID FROM TBL_GROUP WHERE NAME=?`, [GROUP_PARTNER]) as QueryA)[0].ID;

        // user-groups
        await conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [u1.insertId, viewGroupId]);
        await conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [u1.insertId, editGroupId]);
        await conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [u1.insertId, adminGroupId]);
        await conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [u1.insertId, partnerGroupId]);
        await conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [u2.insertId, viewGroupId]);
        await conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [u2.insertId, editGroupId]);
        await conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [u2.insertId, adminGroupId]);
        await conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [u2.insertId, partnerGroupId]);
        await conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [u3.insertId, viewGroupId]);
        await conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [u3.insertId, editGroupId]);
        await conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [u3.insertId, adminGroupId]);
        await conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [u3.insertId, partnerGroupId]);

        // user-theme
        await conn.query(`INSERT INTO TBL_USER_THEME (USER_ID, THEME) VALUES (?, ?)`, [u1.insertId, nextTheme()]);
        await conn.query(`INSERT INTO TBL_USER_THEME (USER_ID, THEME) VALUES (?, ?)`, [u2.insertId, nextTheme()]);
        await conn.query(`INSERT INTO TBL_USER_THEME (USER_ID, THEME) VALUES (?, ?)`, [u3.insertId, nextTheme()]);


        // various users (group, theme etc)
        for (const i of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
            const uV: QueryResponse = await conn.query(`INSERT INTO TBL_USER (USERNAME, CREATION_DATE, LAST_UPDATE, EMAIL, STATUS, PASSWORD, FIRSTNAME, LASTNAME) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [`viewer${i}`, new Date(), new Date(), `viewer${i}@gmail.com`, 'ENABLED', hashedPassword('test'), `viewer${i}_firstname`, `viewer${i}_lastname`]);
            const uE: QueryResponse = await conn.query(`INSERT INTO TBL_USER (USERNAME, CREATION_DATE, LAST_UPDATE, EMAIL, STATUS, PASSWORD, FIRSTNAME, LASTNAME) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [`editor${i}`, new Date(), new Date(), `editor${i}@gmail.com`, 'ENABLED', hashedPassword('test'), `editor${i}_firstname`, `editor${i}_lastname`]);
            const uA: QueryResponse = await conn.query(`INSERT INTO TBL_USER (USERNAME, CREATION_DATE, LAST_UPDATE, EMAIL, STATUS, PASSWORD, FIRSTNAME, LASTNAME) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [`admin${i}`, new Date(), new Date(), `admin${i}@gmail.com`, 'ENABLED', hashedPassword('test'), `admin${i}_firstname`, `admin${i}_lastname`]);
            const uP: QueryResponse = await conn.query(`INSERT INTO TBL_USER (USERNAME, CREATION_DATE, LAST_UPDATE, EMAIL, STATUS, PASSWORD, FIRSTNAME, LASTNAME) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [`partner${i}`, new Date(), new Date(), `partner${i}@gmail.com`, 'ENABLED', hashedPassword('test'), `partner${i}_firstname`, `partner${i}_lastname`]);
            const uD: QueryResponse = await conn.query(`INSERT INTO TBL_USER (USERNAME, CREATION_DATE, LAST_UPDATE, EMAIL, STATUS, PASSWORD, FIRSTNAME, LASTNAME) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [`disabled${i}`, new Date(), new Date(), `disabled${i}@gamil.com`, 'DISABLED', hashedPassword('test'), `disabled${i}_firstname`, `disabled${i}_lastname`]);


            await conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [uV.insertId, viewGroupId]);
            await conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [uE.insertId, editGroupId]);
            await conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [uA.insertId, adminGroupId]);
            await conn.query('INSERT INTO TBL_LOOKUP_USER_GROUP (USER_ID, GROUP_ID) VALUES (?, ?)', [uP.insertId, partnerGroupId]);

            await conn.query(`INSERT INTO TBL_USER_THEME (USER_ID, THEME) VALUES (?, ?)`, [uV.insertId, nextTheme()]);
            await conn.query(`INSERT INTO TBL_USER_THEME (USER_ID, THEME) VALUES (?, ?)`, [uE.insertId, nextTheme()]);
            await conn.query(`INSERT INTO TBL_USER_THEME (USER_ID, THEME) VALUES (?, ?)`, [uA.insertId, nextTheme()]);
            await conn.query(`INSERT INTO TBL_USER_THEME (USER_ID, THEME) VALUES (?, ?)`, [uP.insertId, nextTheme()]);
        }
    });
}



let themeIndex: number = 0;
const themes: string[] = [
    Themes.THEME_DEEPPURPLE_AMBER_LIGHT.toString(),
    Themes.THEME_DEEPPURPLE_AMBER_DARK.toString(),
    Themes.THEME_PINK_BLUEGREY_LIGHT.toString(),
    Themes.THEME_PINK_BLUEGREY_DARK.toString(),
    Themes.THEME_INDIGO_LIGHTBLUE_LIGHT.toString(),
    Themes.THEME_INDIGO_LIGHTBLUE_DARK.toString(),
    Themes.THEME_INDIGO_PINK_LIGHT.toString(),
    Themes.THEME_INDIGO_PINK_DARK.toString(),
    Themes.THEME_PURPLE_GREEN_LIGHT.toString(),
    Themes.THEME_PURPLE_GREEN_DARK.toString(),
]
const nextTheme = (): string => {
    return themes[themeIndex++%themes.length];
}



