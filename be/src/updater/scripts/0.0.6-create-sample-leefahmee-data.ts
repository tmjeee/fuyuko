import {UPDATER_PROFILE_LEEFAHMEE_DATA} from "../updater";
import {i} from "../../logger";

export const profiles = [UPDATER_PROFILE_LEEFAHMEE_DATA];


export const update = async () => {

    i(`running scripts in ${__filename}`);

    await runImport();

    i(`done running update on ${__filename}`);
};

const runImport = async () => {

};
