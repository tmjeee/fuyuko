import {i} from "../../logger";
import path from "path";
import util from "util";
import fs from "fs";
import {doInDbConnection} from "../../db";
import {Connection} from "mariadb";
import {Group, GROUP_ADMIN, GROUP_EDIT, GROUP_PARTNER, GROUP_VIEW} from "../../model/group.model";
import {UPDATER_PROFILE_CORE} from "../updater";
import {addOrUpdateGroup, getGroupByName} from "../../service/group.service";
import {checkErrors} from "../script-util";
import {addOrUpdateRole, addRoleToGroup, getRoleByName} from "../../service/role.service";
import {Role, ROLE_ADMIN, ROLE_EDIT, ROLE_PARTNER, ROLE_VIEW} from "../../model/role.model";
import {addGlobalAvatar, addGlobalImage} from "../../service/avatar.service";

export const profiles = [UPDATER_PROFILE_CORE];

export const update = async () => {

    i(`running scripts in ${__filename}`);

    await INSERT_GLOBAL_AVATARS();
    await INSERT_GLOBAL_IMAGES();
    await INSERT_GROUPS_AND_ROLES();

    i(`done running update on ${__filename}`);
};

const INSERT_GROUPS_AND_ROLES = async () => {
    await doInDbConnection(async (conn: Connection) => {
        // === GROUP
        let errors: string[] = [];
        errors = await addOrUpdateGroup({ id: -1, name: GROUP_VIEW, description: `Group with VIEW role` });
        checkErrors(errors, `Failed to create Group with VIEW role`);
        const gView: Group = await getGroupByName(GROUP_VIEW);

        errors = await addOrUpdateGroup({ id: -1, name: GROUP_EDIT, description: `Group with VIEW & EDIT roles` });
        checkErrors(errors, `Failed to create Group with VIEW & EDIT roles`);
        const gEdit: Group = await getGroupByName(GROUP_EDIT);

        errors = await addOrUpdateGroup({ id: -1, name: GROUP_ADMIN, description: `Group with VIEW & EDIT & PARTNER & ADMIN roles` });
        checkErrors(errors, `Failed to create Group with VIEW & EDIT & PARTNER & ADMIN roles`);
        const gAdmin: Group = await getGroupByName(GROUP_ADMIN);

        errors = await addOrUpdateGroup({ id: -1, name: GROUP_PARTNER, description: `Group with PARTNER role` });
        checkErrors(errors, `Failed to create Group with PARTNER role`);
        const gPartner: Group = await getGroupByName(GROUP_PARTNER);

        // === ROLE
        errors = await addOrUpdateRole({id: -1, name: ROLE_VIEW, description: `VIEW Role`});
        checkErrors(errors, `Failed to create VIEW role`);
        const rView: Role = await getRoleByName(ROLE_VIEW);

        errors = await addOrUpdateRole({id: -1, name: ROLE_EDIT, description: `EDIT Role`});
        checkErrors(errors, `Failed to create EDIT role`);
        const rEdit: Role = await getRoleByName(ROLE_EDIT);

        errors = await addOrUpdateRole({id: -1, name: ROLE_ADMIN, description: `ADMIN Role`});
        checkErrors(errors, `Failed to create ADMIN role`);
        const rAdmin: Role = await getRoleByName(ROLE_ADMIN);

        errors = await addOrUpdateRole({id: -1, name: ROLE_PARTNER, description: `PARTNER Role`});
        checkErrors(errors, `Failed to create PARTNER role`);
        const rPartner: Role = await getRoleByName(ROLE_PARTNER);


        // group-roles
        errors = await addRoleToGroup(gView.id, ROLE_VIEW);
        checkErrors(errors, `Failed to link Group id ${gView.id} to ${ROLE_VIEW}`)
        errors = await addRoleToGroup(gEdit.id, ROLE_VIEW);
        checkErrors(errors, `Failed to link Group id ${gEdit.id} to ${ROLE_VIEW}`)
        errors = await addRoleToGroup(gEdit.id, ROLE_EDIT);
        checkErrors(errors, `Failed to link Group id ${gEdit.id} to ${ROLE_EDIT}`)
        errors = await addRoleToGroup(gAdmin.id, ROLE_VIEW);
        checkErrors(errors, `Failed to link Group id ${gAdmin.id} to ${ROLE_VIEW}`)
        errors = await addRoleToGroup(gAdmin.id, ROLE_EDIT);
        checkErrors(errors, `Failed to link Group id ${gAdmin.id} to ${ROLE_EDIT}`)
        errors = await addRoleToGroup(gAdmin.id, ROLE_ADMIN);
        checkErrors(errors, `Failed to link Group id ${gAdmin.id} to ${ROLE_ADMIN}`)
        errors = await addRoleToGroup(gAdmin.id, ROLE_PARTNER);
        checkErrors(errors, `Failed to link Group id ${gAdmin.id} to ${ROLE_PARTNER}`)
        errors = await addRoleToGroup(gPartner.id, ROLE_PARTNER);
        checkErrors(errors, `Failed to link Group id ${gPartner.id} to ${ROLE_PARTNER}`)
    });
}

const INSERT_GLOBAL_AVATARS = async () => {
    const avatarAssetsDir: string = path.resolve(__dirname, '../assets/avatars');
    const files: string[] = await util.promisify(fs.readdir)(avatarAssetsDir);

    const errs: string[] = [];
    for (const file of files) {
        const fullPath = `${avatarAssetsDir}${path.sep}${file}`;
        const buffer: Buffer = Buffer.from(await util.promisify(fs.readFile)(fullPath));
        errs.push(...await addGlobalAvatar(file, buffer));
    }
    checkErrors(errs, errs.join(', '));
};

const INSERT_GLOBAL_IMAGES = async () => {
    const globalImagesAssetsDir: string = path.resolve(__dirname, '../assets/global-images');
    const files: string[] = await util.promisify(fs.readdir)(globalImagesAssetsDir);

    const errs: string[] = [];
    for (const file of files) {
        const fullPath = `${globalImagesAssetsDir}${path.sep}${file}`;
        const fileNameOnly = path.basename(file).split('.')[0];
        const buffer: Buffer = Buffer.from(await util.promisify(fs.readFile)(fullPath));

        errs.push(... await addGlobalImage(file, fileNameOnly, buffer));
    }
    checkErrors(errs, errs.join(', '));
}

