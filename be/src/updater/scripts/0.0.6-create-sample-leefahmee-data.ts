import {UPDATER_PROFILE_LEEFAHMEE_DATA} from "../updater";
import {i} from "../../logger";
import {View} from "../../model/view.model";
import {addOrUpdateViews, getViewByName} from "../../service/view.service";
import {checkErrors} from "../script-util";
import {Attribute} from "../../model/attribute.model";
import {getAttributesInView, saveAttributes} from "../../service/attribute.service";
import {l} from "../../logger/logger";

export const profiles = [UPDATER_PROFILE_LEEFAHMEE_DATA];


export const update = async () => {

    i(`running scripts in ${__filename}`);

    await runImport();

    i(`done running update on ${__filename}`);
};

const runImport = async () => {
    // create view
    let view: View = await getViewByName('Lee Fah Mee');
    if (!view) {
        const errors: string[] = await addOrUpdateViews([
            {
                id: -1,
                name: 'Cars',
                description: 'Cars View'
            } as View
        ]);
        checkErrors(errors, `Failed to create Cars view`);
        view = await getViewByName('Cars');
    }

    // create attributes
    let attributes: Attribute[] = await getAttributesInView(view.id);
    if (!attributes || !attributes.length) {
        const errors: string[] = await saveAttributes(view.id, [
            {
                id: -1,
                name: `Weight`,
                type: 'string',
                description: 'Make description'
            }  as Attribute,
            {
                id: -1,
                name: `Model`,
                type: 'string',
                description: 'Model description'
            } as Attribute,
            {
                id: -1,
                name: 'Year',
                type: 'number',
                description: 'Year description'
            } as Attribute
        ], (level, msg) => l(level, msg));
        checkErrors(errors, `Failed ot create attributes for Cars view`);
        attributes = await getAttributesInView(view.id);
    }

};
