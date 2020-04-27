import {e, i} from "../../logger";
import {doInDbConnection} from "../../db";
import {Connection} from "mariadb";
import {sprintf} from "sprintf";
import * as Path from "path";
import util from "util";
import {readFile} from "fs";
import {GROUP_ADMIN, GROUP_EDIT, GROUP_PARTNER, GROUP_VIEW} from "../../model/group.model";
import {addOrUpdateItem, getItemByName, hashedPassword} from "../../service";
import {UPDATER_PROFILE_TEST_DATA} from "../updater";
import {getGroupByName} from "../../service/group.service";
import {getViewByName, saveOrUpdateViews} from "../../service/view.service";
import {View} from "../../model/view.model";
import {selfRegister} from "../../service/self-registration.service";
import {createInvitation} from "../../service/invitation.service";
import {getAttributesInView, saveAttributes} from "../../service/attribute.service";
import {Attribute, Pair1, Pair2} from "../../model/attribute.model";
import {
    createAreaAttribute,
    createCurrencyAttribute,
    createDateAttribute,
    createDimensionAttribute,
    createDoubleSelectAttribute,
    createHeightAttribute,
    createLengthAttribute,
    createNumberAttribute,
    createSelectAttribute,
    createStringAttribute,
    createTextAttribute,
    createVolumeAttribute,
    createWidthAttribute
} from "../../shared-utils/attribute-creator.utils";
import {
    addOrUpdatePricingStructures,
    getPricingStructureByName, linkPricingStructureWithGroupId
} from "../../service/pricing-structure.service";
import {PricingStructure} from "../../model/pricing-structure.model";
import {Item, StringValue, TextValue} from "../../model/item.model";
import {addItemImage} from "../../service/item-image.service";
import {setPrices} from "../../service/pricing-structure-item.service";
import {addOrUpdateRules} from "../../service/rule.service";
import {Rule, ValidateClause, WhenClause} from "../../model/rule.model";
import {checkErrors} from "../script-util";


export const profiles = [UPDATER_PROFILE_TEST_DATA];

export const update = async () => {

    i(`running scripts in ${__filename}`);

    await INSERT_DATA();

    i(`done running update on ${__filename}`);
};


const INSERT_DATA = async () => {
    await doInDbConnection(async (conn: Connection) => {

        // === GROUPS
        const viewGroupId: number = (await getGroupByName(GROUP_VIEW)).id;
        const editGroupId: number = (await getGroupByName(GROUP_EDIT)).id;
        const adminGroupId: number = (await getGroupByName(GROUP_ADMIN)).id;
        const partnerGroupId: number = (await getGroupByName(GROUP_PARTNER)).id;

        // === VIEWS
        const errors: string[] = await saveOrUpdateViews([
            {
                id: -1,
                name: `Test View 1`,
                description: `Test View 1 Description`,
            },
            {
                id: -1,
                name: `Test View 2`,
                description: `Test View 2 Description`,
            },
            {
                id: -1,
                name: `Test View 3`,
                description: `Test View 3 Description`,
            }
        ]);
        checkErrors(errors, `error creating test views`);

        const v1: View = await getViewByName(`Test View 1`);
        const v2: View = await getViewByName(`Test View 2`);
        const v3: View = await getViewByName(`Test View 3`);

        // === INVITATION
        for (let i = 1; i < 100; i++) {
            const errors: string[] = await createInvitation(`invitation${i}@gmail.com`, [viewGroupId, partnerGroupId], false, `code${i}`);
            checkErrors(errors, `error creating invitation`);
        }

        // === SELF REGISTRATIONS
        for (let i = 1; i < 100; i++) {
            const r: {errors: string[], registrationId: number, email: string, username: string} = await selfRegister(`self${i}`, `self${i}@gmail.com`, `self${i}-firstname`, `self${i}-lastname`, hashedPassword(`test`));
            checkErrors(r.errors, `error creating self registration`);
        }

        await INSERT_VIEW_DATA(v1.id, viewGroupId, editGroupId, adminGroupId, partnerGroupId, conn);
        await INSERT_VIEW_DATA(v2.id, viewGroupId, editGroupId, adminGroupId, partnerGroupId, conn);
    });
}

const INSERT_VIEW_DATA = async (viewId: number, viewGroupId: number, editGroupId: number, adminGroupId: number, partnerGroupId: number, conn: Connection) => {

    // === ATTRIBUTES ===
    let errors: string[] = await saveAttributes(viewId, [
        createStringAttribute(`string attribute`, `string attribute description`),
        createTextAttribute(`text attribute`, `text attribute description`),
        createNumberAttribute(`number attribute`, `number attribute description`),
        createDateAttribute(`date attribute`, `date attribute description`),
        createCurrencyAttribute(`currency attribute`, `currency attribute description`),
        createVolumeAttribute(`volume attribute`, `volume attribute description`),
        createDimensionAttribute(`dimension attribute`, `dimension attribute description`),
        createAreaAttribute(`area attribute`, `area attribute description`),
        createLengthAttribute(`length attribute`, `length attribute description`),
        createWidthAttribute(`width attribute`, `width attribute description`),
        createHeightAttribute(`height attribute`, `height attribute description`),
        createSelectAttribute(`select attribute`, `select attribute description`, [
            { id:-1, key: 'key1', value: 'value1' } as Pair1,
            { id:-1, key: 'key2', value: 'value2' } as Pair1,
            { id:-1, key: 'key3', value: 'value3' } as Pair1,
            { id:-1, key: 'key4', value: 'value4' } as Pair1,
            { id:-1, key: 'key5', value: 'value5' } as Pair1,
            { id:-1, key: 'key6', value: 'value6' } as Pair1,
            { id:-1, key: 'key7', value: 'value7' } as Pair1,
            { id:-1, key: 'key8', value: 'value8' } as Pair1,
            { id:-1, key: 'key9', value: 'value9' } as Pair1,
        ]),
        createDoubleSelectAttribute(`doubleselect attribute`, `doubleselect attribute description`, [
            { id:-1, key: 'key1', value: 'value1' } as Pair1,
            { id:-1, key: 'key2', value: 'value2' } as Pair1,
            { id:-1, key: 'key3', value: 'value3' } as Pair1,
            { id:-1, key: 'key4', value: 'value4' } as Pair1,
            { id:-1, key: 'key5', value: 'value5' } as Pair1,
            { id:-1, key: 'key6', value: 'value6' } as Pair1,
            { id:-1, key: 'key7', value: 'value7' } as Pair1,
            { id:-1, key: 'key8', value: 'value8' } as Pair1,
            { id:-1, key: 'key9', value: 'value9' } as Pair1,
        ], [
            { id: -1, key1: 'key1', key2: 'xkey11', value: 'xvalue11'} as Pair2,
            { id: -1, key1: 'key1', key2: 'xkey12', value: 'xvalue12'} as Pair2,
            { id: -1, key1: 'key1', key2: 'xkey13', value: 'xvalue13'} as Pair2,
            { id: -1, key1: 'key1', key2: 'xkey14', value: 'xvalue14'} as Pair2,
            { id: -1, key1: 'key1', key2: 'xkey15', value: 'xvalue15'} as Pair2,
            { id: -1, key1: 'key1', key2: 'xkey16', value: 'xvalue16'} as Pair2,
            { id: -1, key1: 'key1', key2: 'xkey17', value: 'xvalue17'} as Pair2,
            { id: -1, key1: 'key1', key2: 'xkey18', value: 'xvalue18'} as Pair2,
            { id: -1, key1: 'key1', key2: 'xkey19', value: 'xvalue19'} as Pair2,

            { id: -1, key1: 'key2', key2: 'xkey21', value: 'xvalue21'} as Pair2,
            { id: -1, key1: 'key2', key2: 'xkey22', value: 'xvalue22'} as Pair2,
            { id: -1, key1: 'key2', key2: 'xkey23', value: 'xvalue23'} as Pair2,
            { id: -1, key1: 'key2', key2: 'xkey24', value: 'xvalue24'} as Pair2,
            { id: -1, key1: 'key2', key2: 'xkey25', value: 'xvalue25'} as Pair2,
            { id: -1, key1: 'key2', key2: 'xkey26', value: 'xvalue26'} as Pair2,
            { id: -1, key1: 'key2', key2: 'xkey27', value: 'xvalue27'} as Pair2,
            { id: -1, key1: 'key2', key2: 'xkey28', value: 'xvalue28'} as Pair2,
            { id: -1, key1: 'key2', key2: 'xkey29', value: 'xvalue29'} as Pair2,

            { id: -1, key1: 'key3', key2: 'xkey31', value: 'xvalue31'} as Pair2,
            { id: -1, key1: 'key3', key2: 'xkey32', value: 'xvalue32'} as Pair2,
            { id: -1, key1: 'key3', key2: 'xkey33', value: 'xvalue33'} as Pair2,
            { id: -1, key1: 'key3', key2: 'xkey34', value: 'xvalue34'} as Pair2,
            { id: -1, key1: 'key3', key2: 'xkey35', value: 'xvalue35'} as Pair2,
            { id: -1, key1: 'key3', key2: 'xkey36', value: 'xvalue36'} as Pair2,
            { id: -1, key1: 'key3', key2: 'xkey37', value: 'xvalue37'} as Pair2,
            { id: -1, key1: 'key3', key2: 'xkey38', value: 'xvalue38'} as Pair2,
            { id: -1, key1: 'key3', key2: 'xkey39', value: 'xvalue39'} as Pair2,

            { id: -1, key1: 'key4', key2: 'xkey41', value: 'xvalue41'} as Pair2,
            { id: -1, key1: 'key4', key2: 'xkey42', value: 'xvalue42'} as Pair2,
            { id: -1, key1: 'key4', key2: 'xkey43', value: 'xvalue43'} as Pair2,
            { id: -1, key1: 'key4', key2: 'xkey44', value: 'xvalue44'} as Pair2,
            { id: -1, key1: 'key4', key2: 'xkey45', value: 'xvalue45'} as Pair2,
            { id: -1, key1: 'key4', key2: 'xkey46', value: 'xvalue46'} as Pair2,
            { id: -1, key1: 'key4', key2: 'xkey47', value: 'xvalue47'} as Pair2,
            { id: -1, key1: 'key4', key2: 'xkey48', value: 'xvalue48'} as Pair2,
            { id: -1, key1: 'key4', key2: 'xkey49', value: 'xvalue49'} as Pair2,

            { id: -1, key1: 'key5', key2: 'xkey51', value: 'xvalue51'} as Pair2,
            { id: -1, key1: 'key5', key2: 'xkey52', value: 'xvalue52'} as Pair2,
            { id: -1, key1: 'key5', key2: 'xkey53', value: 'xvalue53'} as Pair2,
            { id: -1, key1: 'key5', key2: 'xkey54', value: 'xvalue54'} as Pair2,
            { id: -1, key1: 'key5', key2: 'xkey55', value: 'xvalue55'} as Pair2,
            { id: -1, key1: 'key5', key2: 'xkey56', value: 'xvalue56'} as Pair2,
            { id: -1, key1: 'key5', key2: 'xkey57', value: 'xvalue57'} as Pair2,
            { id: -1, key1: 'key5', key2: 'xkey58', value: 'xvalue58'} as Pair2,
            { id: -1, key1: 'key5', key2: 'xkey59', value: 'xvalue59'} as Pair2,

            { id: -1, key1: 'key6', key2: 'xkey61', value: 'xvalue61'} as Pair2,
            { id: -1, key1: 'key6', key2: 'xkey62', value: 'xvalue62'} as Pair2,
            { id: -1, key1: 'key6', key2: 'xkey63', value: 'xvalue63'} as Pair2,
            { id: -1, key1: 'key6', key2: 'xkey64', value: 'xvalue64'} as Pair2,
            { id: -1, key1: 'key6', key2: 'xkey65', value: 'xvalue65'} as Pair2,
            { id: -1, key1: 'key6', key2: 'xkey66', value: 'xvalue66'} as Pair2,
            { id: -1, key1: 'key6', key2: 'xkey67', value: 'xvalue67'} as Pair2,
            { id: -1, key1: 'key6', key2: 'xkey68', value: 'xvalue68'} as Pair2,
            { id: -1, key1: 'key6', key2: 'xkey69', value: 'xvalue69'} as Pair2,

            { id: -1, key1: 'key7', key2: 'xkey71', value: 'xvalue71'} as Pair2,
            { id: -1, key1: 'key7', key2: 'xkey72', value: 'xvalue72'} as Pair2,
            { id: -1, key1: 'key7', key2: 'xkey73', value: 'xvalue73'} as Pair2,
            { id: -1, key1: 'key7', key2: 'xkey74', value: 'xvalue74'} as Pair2,
            { id: -1, key1: 'key7', key2: 'xkey75', value: 'xvalue75'} as Pair2,
            { id: -1, key1: 'key7', key2: 'xkey76', value: 'xvalue76'} as Pair2,
            { id: -1, key1: 'key7', key2: 'xkey77', value: 'xvalue77'} as Pair2,
            { id: -1, key1: 'key7', key2: 'xkey78', value: 'xvalue78'} as Pair2,
            { id: -1, key1: 'key7', key2: 'xkey79', value: 'xvalue79'} as Pair2,

            { id: -1, key1: 'key8', key2: 'xkey81', value: 'xvalue81'} as Pair2,
            { id: -1, key1: 'key8', key2: 'xkey82', value: 'xvalue82'} as Pair2,
            { id: -1, key1: 'key8', key2: 'xkey83', value: 'xvalue83'} as Pair2,
            { id: -1, key1: 'key8', key2: 'xkey84', value: 'xvalue84'} as Pair2,
            { id: -1, key1: 'key8', key2: 'xkey85', value: 'xvalue85'} as Pair2,
            { id: -1, key1: 'key8', key2: 'xkey86', value: 'xvalue86'} as Pair2,
            { id: -1, key1: 'key8', key2: 'xkey87', value: 'xvalue87'} as Pair2,
            { id: -1, key1: 'key8', key2: 'xkey88', value: 'xvalue88'} as Pair2,
            { id: -1, key1: 'key8', key2: 'xkey89', value: 'xvalue89'} as Pair2,

            { id: -1, key1: 'key9', key2: 'xkey91', value: 'xvalue91'} as Pair2,
            { id: -1, key1: 'key9', key2: 'xkey92', value: 'xvalue92'} as Pair2,
            { id: -1, key1: 'key9', key2: 'xkey93', value: 'xvalue93'} as Pair2,
            { id: -1, key1: 'key9', key2: 'xkey94', value: 'xvalue94'} as Pair2,
            { id: -1, key1: 'key9', key2: 'xkey95', value: 'xvalue95'} as Pair2,
            { id: -1, key1: 'key9', key2: 'xkey96', value: 'xvalue96'} as Pair2,
            { id: -1, key1: 'key9', key2: 'xkey97', value: 'xvalue97'} as Pair2,
            { id: -1, key1: 'key9', key2: 'xkey98', value: 'xvalue98'} as Pair2,
            { id: -1, key1: 'key9', key2: 'xkey99', value: 'xvalue99'} as Pair2,
        ])
    ]);
    checkErrors(errors, `Failed to save attributes`);
    const viewAttributes: Attribute[] = await getAttributesInView(viewId);
    const viewStringAttribute: Attribute = viewAttributes.find((a: Attribute) => a.name === `string attribute`);
    const viewTextAttribute: Attribute = viewAttributes.find((a: Attribute) => a.name === `text attribute`);
    const viewNumberAttribute: Attribute = viewAttributes.find((a: Attribute) => a.name === `number attribute`);
    const viewDateAttribute: Attribute = viewAttributes.find((a: Attribute) => a.name === `date attribute`);
    const viewCurrencyAttribute:Attribute = viewAttributes.find((a: Attribute) => a.name === `currency attribute`);
    const viewVolumeAttribute: Attribute = viewAttributes.find((a: Attribute) => a.name === `volume attribute`);
    const viewDimensionAttribute: Attribute = viewAttributes.find((a: Attribute) => a.name === `dimension attribute`);
    const viewAreaAttribute: Attribute = viewAttributes.find((a: Attribute) => a.name === `area attribute`);
    const viewLengthAttribute: Attribute = viewAttributes.find((a: Attribute) => a.name === `length attribute`);
    const viewWidthAttribute: Attribute = viewAttributes.find((a: Attribute) => a.name === `width attribute`);
    const viewHeightAttribute: Attribute = viewAttributes.find((a: Attribute) => a.name === `height attribute`);
    const viewSelectAttribute: Attribute = viewAttributes.find((a: Attribute) => a.name === `select attribute`);
    const viewDoubleselectAttribute: Attribute = viewAttributes.find((a: Attribute) => a.name === `doubleselect attribute`);

    // === PRICING STRUCTURE
    errors = await addOrUpdatePricingStructures([
        {
           id: -1,
           name: `Pricing Structure #1`,
           description: `Pricing Structure #1 Description`,
           viewId,
        } as PricingStructure,
        {
            id: -1,
            name: `Pricing Structure #2`,
            description: `Pricing Structure #2 Description`,
            viewId,
        } as PricingStructure,
    ]);
    checkErrors(errors, `Failed to save pricing structures`);

    const ps1: PricingStructure = await getPricingStructureByName(`Pricing Structure #1`);
    const ps2: PricingStructure = await getPricingStructureByName(`Pricing Structure #2`);

    // pricing structure with groups
    errors = await linkPricingStructureWithGroupId(ps1.id, adminGroupId);
    checkErrors(errors, `Failed to link group Id ${adminGroupId} with pricing structure ${ps1.id}`);
    errors = await linkPricingStructureWithGroupId(ps1.id, partnerGroupId);
    checkErrors(errors, `Failed to link group Id ${partnerGroupId} with pricing structure ${ps1.id}`);
    errors = await linkPricingStructureWithGroupId(ps2.id, adminGroupId);
    checkErrors(errors, `Failed to link group Id ${adminGroupId} with pricing structure ${ps2.id}`);
    errors = await linkPricingStructureWithGroupId(ps2.id, partnerGroupId);
    checkErrors(errors, `Failed to link group Id ${partnerGroupId} with pricing structure ${ps2.id}`);

    // items
    await createManyItems(conn, ps1.id, viewId, viewStringAttribute, viewTextAttribute, viewNumberAttribute, viewDateAttribute, viewCurrencyAttribute,
        viewVolumeAttribute, viewDimensionAttribute, viewAreaAttribute, viewLengthAttribute, viewWidthAttribute, viewHeightAttribute, viewSelectAttribute,
        viewDoubleselectAttribute);

    // rules
    await createManyRules(conn, viewId, viewStringAttribute.id, viewTextAttribute.id);
};

const createManyRules = async(conn: Connection, viewId: number, att1Id: number, att2Id: number) => {

    for (let x=1; x<=7; x++) {
        await addOrUpdateRules(viewId, [
            {
                id: -1,
                name: `Rule #${x}`,
                description: `Rule #${x} Description`,
                validateClauses: [
                    {
                        id: -1,
                        attributeId: att1Id,
                        operator: 'eq',
                        condition: [
                            {
                                value: 'val string 1'
                            } as StringValue,
                            {
                                value: 'val string 2'
                            } as StringValue
                        ]
                    } as ValidateClause
                ],
                whenClauses: [
                    {
                        id: -1,
                        attributeId: att2Id,
                        operator: 'not eq',
                        condition: [
                            {
                                value: 'val text 1'
                            } as TextValue,
                            {
                                value: 'val text 2'
                            } as TextValue
                        ]
                    } as WhenClause
                ]

            } as Rule
        ]);
    }
}

const createManyItems = async (conn: Connection, pricingStructureId: number, viewId: number,
                               stringAttribute: Attribute, textAttribute: Attribute, numberAttribute: Attribute,
                               dateAttribute: Attribute, currencyAttribute: Attribute, volumeAttribute: Attribute, dimensionAttribute: Attribute,
                               areaAttribute: Attribute, lengthAttribute: Attribute, widthAttribute: Attribute, heightAttribute: Attribute,
                               selectAttribute: Attribute, doubleSelectAttribute: Attribute) => {
    let _c = 0;
    const c = () => {
        return (((_c++)%351)+1);
    }


    let errors: string[] = await addOrUpdateItem(viewId, {
       id: -1,
       name: `Item-1`,
       description: `Item-1 Description`,
       parentId: null,
       images: [],
       children: [
           {
               id: -1,
               name: `Item-1-1`,
               description: `Item-1-1 Description`,
               children: []
           } as Item,
           {
               id: -1,
               name: `Item-1-2`,
               description: `Item-1-2 Description`,
               children: []
           }
       ]
    } as Item);
    checkErrors(errors, `Item-1 failed to be created`);

    errors = await addOrUpdateItem(viewId, {
        id: -1,
        name: `Item-2`,
        description: `Item-2 Description`,
        parentId: null,
        images: [],
        children: []
    } as Item);
    checkErrors(errors, `Item-2 failed to be created`);

    errors = await addOrUpdateItem(viewId, {
        id: -1,
        name: `Item-3`,
        description: `Item-3 Description`,
        parentId: null,
        images: [],
        children: []
    } as Item);
    checkErrors(errors, `Item-3 failed to be created`);

    errors = await addOrUpdateItem(viewId, {
        id: -1,
        name: `Item-4`,
        description: `Item-4 Description`,
        parentId: null,
        images: [],
        children: []
    } as Item);
    checkErrors(errors, `Item-4 failed to be created`);

    errors = await addOrUpdateItem(viewId, {
        id: -1,
        name: `Item-5`,
        description: `Item-5 Description`,
        parentId: null,
        images: [],
        children: []
    } as Item);
    checkErrors(errors, `Item-5 failed to be created`);

    errors = await addOrUpdateItem(viewId, {
        id: -1,
        name: `Item-6`,
        description: `Item-6 Description`,
        parentId: null,
        images: [],
        children: []
    } as Item);
    checkErrors(errors, `Item-6 failed to be created`);

    errors = await addOrUpdateItem(viewId, {
        id: -1,
        name: `Item-7`,
        description: `Item-7 Description`,
        parentId: null,
        images: [],
        children: []
    } as Item);
    checkErrors(errors, `Item-7 failed to be created`);

    const item1: Item = await getItemByName(viewId, `Item-1`);
    if (!item1) {
        throw new Error(`Failed to retrieve Item-1 from view id ${viewId}`);
    }
    const item2: Item = await getItemByName(viewId, `Item-2`);
    if (!item2) {
        throw new Error(`Failed to retrieve Item-2 from view id ${viewId}`);
    }
    const item3: Item = await getItemByName(viewId, `Item-3`);
    if (!item3) {
        throw new Error(`Failed to retrieve Item-3 for view id ${viewId}`);
    }
    const item4: Item = await getItemByName(viewId, `Item-4`);
    if (!item4) {
        throw new Error(`Failed to retrieve Item-4 for view id ${viewId}`);
    }
    const item5: Item = await getItemByName(viewId, `Item-5`);
    if (!item5) {
        throw new Error(`Failed to retrieve Item-5 for view id ${viewId}`);
    }
    const item6: Item = await getItemByName(viewId, `Item-6`);
    if (!item6) {
        throw new Error(`Failed to retrieve Item-6 for view id ${viewId}`);
    }
    const item7: Item = await getItemByName(viewId, `Item-7`);
    if (!item7) {
        throw new Error(`Failed to retrieve Item-7 for view id ${viewId}`);
    }

    const allItems: Item[] = [item1, item2, item3, item4, item5, item6, item7];
    for (const item of allItems) {
        for (let i = 0; i< 3; i++) {
            const fileName = sprintf('%04d.jpg', c());
            const isPrimary = (i === 0);
            const fullPath = Path.resolve(__dirname, '../assets/item-images', fileName);

            const buffer: Buffer = await util.promisify(readFile)(fullPath);
            const r: boolean = await addItemImage(item.id, fileName, buffer, true);
            if (!r) {
                const msg = (`Failed to add image ${fileName} for Item ${item.name}`);
                console.error(msg);
                throw new Error(msg);
            }
        }
    }

    for (let i = 0; i< allItems.length; i++) {
        const item: Item = allItems[i];
        const prices: number[] = [1.10, 2.20, 3.30, 4.40, 5.50, 6.60, 7.70];
        const errors: string[] = await setPrices([
            {
                pricingStructureId,
                item: {
                        itemId: item.id,
                        price: prices[i%prices.length],
                        country: 'AUD',
                }
            }
        ]);
        checkErrors(errors, `Failed to set price for item id ${item.id}`);

        for (let j = 0; j< item.children.length; j++) {
            const i: Item = item.children[j];
            const errors: string[] = await setPrices([{
                pricingStructureId,
                item: {
                    itemId: i.id,
                    price: 10.10,
                    country: 'AUD'
                }
            }]);
            checkErrors(errors, `Failed to set price for children item id ${i.id} with parent item id ${item.id}`);
        }
    }
}


