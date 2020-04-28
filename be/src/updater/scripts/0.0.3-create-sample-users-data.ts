import {Connection} from "mariadb";
import {i} from '../../logger';
import {doInDbConnection} from '../../db';
import {Group, GROUP_ADMIN, GROUP_EDIT, GROUP_PARTNER, GROUP_VIEW} from "../../model/group.model";
import {Themes} from "../../model/theme.model";
import {UPDATER_PROFILE_TEST_DATA} from "../updater";
import {addUser, addUserToGroup, getUserByUsername, updateUser} from "../../service/user.service";
import {checkErrors} from "../script-util";
import {getGroupByName} from "../../service/group.service";
import {User} from "../../model/user.model";
import {DISABLED} from "../../model/status.model";

export const profiles = [UPDATER_PROFILE_TEST_DATA];

export const update = async () => {

    i(`running scripts in ${__filename}`);

    await INSERT_DATA();

    i(`done running update on ${__filename}`);
};


const INSERT_DATA = async () => {

    await doInDbConnection(async (conn: Connection) => {
        // === USER
        let errors: string[];
        errors = await addUser({ username: 'cypress', email: 'tmjeee@gmail.com', firstName: 'cypress', lastName: 'jee', password: 'test'});
        checkErrors(errors, `Failed to create user cypress`);
        const cypress: User = await getUserByUsername(`cypress`);
        if (!cypress || !cypress.id) { throw new Error(`Failed to get user cypress`)}

        errors = await addUser({ username: 'tmjee', email: 'tmjee1@gmail.com', firstName: 'toby', lastName: 'jee', password: 'test'});
        checkErrors(errors, `Failed to create user tmjee`);
        const tmjee: User = await getUserByUsername('tmjee');
        if (!tmjee || !tmjee.id) { throw new Error(`Failed to get user tmjee`)}

        errors = await addUser({ username: 'sxjee', email: 'sxjee@gmail.com', firstName: 'song xian', lastName: 'jee', password: 'test'});
        checkErrors(errors, `Failed to create user sxjee`);
        const sxjee: User = await getUserByUsername('sxjee');
        if (!sxjee || !sxjee.id) { throw new Error(`Failed to get user sxjee`)}


        for (let i = 1; i< 10; i++ ) {
            errors = await addUser({username: `disabled${i}`, email: `disabled${i}@gmail.com`, firstName: `disabled${i}_firstName`, lastName: `disabled${i}_lastName`, password: `test`, status: DISABLED});
            checkErrors(errors, `Failed to create user disabled${i}`);
        }


        // GROUPS
        const viewGroup: Group = await getGroupByName(GROUP_VIEW);
        if(!viewGroup) { throw new Error(`Failed to find group ${GROUP_VIEW}`)}
        const editGroup: Group = await getGroupByName(GROUP_EDIT);
        if(!editGroup) { throw new Error(`Failed to find group ${GROUP_EDIT}`)}
        const adminGroup: Group = await getGroupByName(GROUP_ADMIN);
        if(!adminGroup) { throw new Error(`Failed to find group ${GROUP_ADMIN}`)}
        const partnerGroup: Group = await getGroupByName(GROUP_PARTNER);
        if(!partnerGroup) { throw new Error(`Failed to find group ${GROUP_PARTNER}`)}


        // user-groups
        errors = await addUserToGroup(cypress.id, viewGroup.id);
        checkErrors(errors, `Failed to add cypress to ${viewGroup.name}`);
        errors = await addUserToGroup(cypress.id, editGroup.id);
        checkErrors(errors, `Failed to add cypress to ${editGroup.name}`);
        errors = await addUserToGroup(cypress.id, adminGroup.id);
        checkErrors(errors, `Failed to add cypress to ${adminGroup.name}`);
        errors = await addUserToGroup(cypress.id, partnerGroup.id);
        checkErrors(errors, `Failed to add cypress to ${partnerGroup.name}`);
        errors = await addUserToGroup(tmjee.id, viewGroup.id);
        checkErrors(errors, `Failed to add tmjee to ${viewGroup.name}`);
        errors = await addUserToGroup(tmjee.id, editGroup.id);
        checkErrors(errors, `Failed to add tmjee to ${editGroup.name}`);
        errors = await addUserToGroup(tmjee.id, adminGroup.id);
        checkErrors(errors, `Failed to add tmjee to ${adminGroup.name}`);
        errors = await addUserToGroup(tmjee.id, partnerGroup.id);
        checkErrors(errors, `Failed to add tmjee to ${partnerGroup.name}`);
        errors = await addUserToGroup(sxjee.id, viewGroup.id);
        checkErrors(errors, `Failed to add sxjee to ${viewGroup.name}`);
        errors = await addUserToGroup(sxjee.id, editGroup.id);
        checkErrors(errors, `Failed to add sxjee to ${editGroup.name}`);
        errors = await addUserToGroup(sxjee.id, adminGroup.id);
        checkErrors(errors, `Failed to add sxjee to ${adminGroup.name}`);
        errors = await addUserToGroup(sxjee.id, partnerGroup.id);
        checkErrors(errors, `Failed to add sxjee to ${partnerGroup.name}`);

        // user-theme
        errors = await updateUser({userId: cypress.id, theme: nextTheme()});
        checkErrors(errors, `Failed to update user cypress's theme`);
        errors = await updateUser({userId: tmjee.id, theme: nextTheme()});
        checkErrors(errors, `Failed to update user tmjee's theme`);
        errors = await updateUser({userId: sxjee.id, theme: nextTheme()});
        checkErrors(errors, `Failed to update user sxjee's theme`);


        // various users (group, theme etc)
        for (const i of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
            errors = await addUser({ username: `viewer${i}`, email: `viewer${i}@gmail.com`, firstName: `viewer${i}_firstname`, lastName: `viewer${i}_lastname`, password: 'test'});
            checkErrors(errors, `Failed to add user viewer${i}`);
            const viewer: User = await getUserByUsername(`viewer${i}`);
            if (!viewer) { throw Error(`Failed to get user viewer${i}`)};

            errors = await addUser({ username: `editor${i}`, email: `editor${i}@gmail.com`, firstName: `editor${i}_firstname`, lastName: `editor${i}_lastname`, password: 'test'});
            checkErrors(errors, `Failed to add user editor${i}`);
            const editor: User = await getUserByUsername(`editor${i}`);
            if (!editor) { throw Error(`Failed to get user editor${i}`)};

            errors = await addUser({ username: `admin${i}`, email: `admin${i}@gmail.com`, firstName: `admin${i}_firstname`, lastName: `admin${i}_lastname`, password: 'test'});
            checkErrors(errors, `Failed to add user admin${i}`);
            const admin: User = await getUserByUsername(`admin${i}`);
            if (!viewer) { throw Error(`Failed to get user admin${i}`)};

            errors = await addUser({ username: `partner${i}`, email: `partner${i}@gmail.com`, firstName: `partner${i}_firstname`, lastName: `partner${i}_lastname`, password: 'test'});
            checkErrors(errors, `Failed to add user partner${i}`);
            const partner: User = await getUserByUsername(`partner${i}`);
            if (!viewer) { throw Error(`Failed to get user partner${i}`)};


            errors = await addUserToGroup(viewer.id, viewGroup.id);
            checkErrors(errors, `Failed to add user viewer${i} to ${viewGroup.name}`);
            errors = await addUserToGroup(editor.id, editGroup.id);
            checkErrors(errors, `Failed to add user editor${i} to ${editGroup.name}`);
            errors = await addUserToGroup(admin.id, adminGroup.id);
            checkErrors(errors, `Failed to add user admin${i} to ${adminGroup.name}`);
            errors = await addUserToGroup(partner.id, partnerGroup.id);
            checkErrors(errors, `Failed to add user partner${i} to ${partnerGroup.name}`);

            errors = await updateUser({userId: viewer.id, theme: nextTheme()});
            checkErrors(errors, `Failed to update user viewer${i}'s theme `);
            errors = await updateUser({userId: editor.id, theme: nextTheme()});
            checkErrors(errors, `Failed to update user editor${i}'s theme `);
            errors = await updateUser({userId: admin.id, theme: nextTheme()});
            checkErrors(errors, `Failed to update user admin${i}'s theme `);
            errors = await updateUser({userId: partner.id, theme: nextTheme()});
            checkErrors(errors, `Failed to update user partner${i}'s theme `);
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



