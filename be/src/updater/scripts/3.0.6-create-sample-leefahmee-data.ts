import {UPDATER_PROFILE_LEEFAHMEE_DATA} from "../updater";
import {i} from "../../logger";
import {View} from "../../model/view.model";
import {addOrUpdateViews, getViewByName} from "../../service/view.service";
import {checkErrors, checkNotNull, checkTrue} from "../script-util";
import {Attribute} from "../../model/attribute.model";
import {getAttributeInViewByName, getAttributesInView, saveAttributes} from "../../service/attribute.service";
import {l} from "../../logger/logger";
import * as Path from "path";
import * as util from "util";
import * as fs from "fs";
import {addItem, addItemImage, getItemByName} from "../../service";
import {Item} from "../../model/item.model";
import {createNewItem} from "../../shared-utils/ui-item-value-creator.utils";

export const profiles = [UPDATER_PROFILE_LEEFAHMEE_DATA];


const MAPPING: any = [
    { name: 'Lee Fah Mee Sarawak Laksa',
        size: '12 bags x 320g',
        carton: '2500 cartons per 40ft',
        images: ['Bihun-Laksa-80g-big.jpg', 'Bihun-Laksa-80g-thumb.jpg'] },
    { name: 'Lee Fah Mee Chlorella Ramen',
        size: '12 pkts x 408g',
        carton: '1051 / 2210 cartons per 40ft',
        images: ['Chlorella-Ramen-big.jpg', 'Chlorella-Ramen-thumb.jpg']},
    { name: 'Lee Fah Mee Dried Noodle Round',
        size: '30 pkts x 200g',
        carton: '2140 cartons per 40ft',
        images: ['Dried-Noodle-Round-big.jpg', 'Dried-Noodle-Round-thumb.jpg']},
    { name: 'Lee Fah Mee Easy-2 Cook Jumbo Pack',
        size: '12 pkts x 408g',
        carton: '1051 / 2210 cartons per 40ft',
        images: ['Easy-2-Cook-big.jpg', 'Easy-2-Cook-thumb.jpg']},
    { name: 'Lee Fah Mee Dried Noodle Flat Type',
        size: '30pkts x 200g',
        carton: '2140 cartons per 40ft',
        images: ['Flat-Mee-Pack-big.jpg', 'Flat-Mee-Pack-thumb.jpg']},
    { name: 'Fourway Borneo Hot & Spicy Keropok',
        size: '8 bags x 10 pkts x 45g',
        carton: '400 cartons per 40ft',
        images: ['Fourway-Borneo-Hot-Spicy-Keropok-big.jpg', 'Fourway-Borneo-Hot-Spicy-Keropok-thumb.jpg']},
    { name: 'Fourway Borneo Prawn Keropok',
        size: '8 bags x 10 pkts x 45g',
        carton: '400 cartons per 40ft',
        images: ['Fourway-Borneo-Prawn-big.jpg', 'Fourway-Borneo-Prawn-thumb.jpg']},
    { name: 'Fourway Fish Crackers Original Flavour (20 bags)',
        size: '20 bags x 30 pkts x 15g',
        carton: '322 / 680 Cartons per 40ft',
        images: ['Fourway-Fish-Crackers-Original-big.jpg', 'Fourway-Fish-Crackers-Original-thumb.jpg']},
    { name: 'Fourway Fish Crackers Original Flavour (30 bags)',
        size: '30 bags x 6 pkts x 15g',
        carton: '322 / 680 Cartons per 40ft',
        images: ['Fourway-Fish-Crackers-Original-big.jpg', 'Fourway-Fish-Crackers-Original-thumb.jpg']},
    { name: 'Fourway Fish Crackers Seaweed Flavour (20 bags)',
        size: '20 bags x 30 pkts x 15g',
        carton: '322 / 680 Cartons per 40ft',
        images: ['Fourway-Fish-Crackers-Seaweed-big.jpg', 'Fourway-Fish-Crackers-Seaweed-thumb.jpg']},
    { name: 'Fourway Fish Crackers Seaweed Flavour (30 bags)',
        size: '30 bags x 6 pkts x 15g',
        carton: '322 / 680 Cartons per 40ft',
        images: ['Fourway-Fish-Crackers-Seaweed-big.jpg', 'Fourway-Fish-Crackers-Seaweed-thumb.jpg']},
    { name: 'Fourway Biskut Ikan Bilis (Anchovy Crackers)',
        size: '8 bags x 10 pkts x 110g',
        carton: '680 Cartons / 40ft',
        images: ['Fourway-Ikan-Bilis-big.jpg', 'Fourway-Ikan-Bilis-thumb.jpg']},
    { name: 'Fourway Cheese Cracker Chip (8 bags)',
        size: '8 bags x 10 pkts x 110g',
        carton: '680 Cartons per 40ft',
        images: ['Fourway-Pack-Cheese-big.jpg', 'Fourway-Pack-Cheese-thumb.jpg']},
    { name: 'Fourway Cheese Cracker Chip (6 bags)',
        size: '6 bags x 30 pkts x 45g',
        carton: '680 Cartons per 40ft',
        images: ['Fourway-Pack-Cheese-big.jpg', 'Fourway-Pack-Cheese-thumb.jpg']},
    { name: 'Fourway Cheese Cracker Chip (30 bags)',
        size: '30 bags x 5 pkts x 45g',
        carton: '680 Cartons per 40ft',
        images: ['Fourway-Pack-Cheese-big.jpg', 'Fourway-Pack-Cheese-thumb.jpg']},
    { name: 'Fourway Crab Crackers Chip (8 bags)',
        size: '8 bags x 10 pkts x 110g',
        carton: '680 Cartons per 40ft',
        images: ['Fourway-Pack-Crab-big.jpg', 'Fourway-Pack-Crab-thumb.jpg']},
    { name: 'Fourway Crab Crackers Chip (6 bags)',
        size: '6 bags x 30 pkts x 45g',
        carton: '680 Cartons per 40ft',
        images: ['Fourway-Pack-Crab-big.jpg', 'Fourway-Pack-Crab-thumb.jpg']},
    { name: 'Fourway Crab Crackers Chip (30 bags)',
        size: '30 bags x 5 pkts x 45g',
        carton: '680 Cartons per 40ft',
        images: ['Fourway-Pack-Crab-big.jpg', 'Fourway-Pack-Crab-thumb.jpg']},
    { name: 'Fourway 3 Angle Seaweed Crackers (8 bags)',
        size: '8 bags x 10pkts x 60g',
        carton: '680 Cartons per 40ft',
        images: ['Fourway-Pack-Seaweed-big.jpg', 'Fourway-Pack-Seaweed-thumb.jpg']},
    { name: 'Fourway 3 Angle Seaweed Crackers (6 bags)',
        size: '6 bags x 30pkts x 25g',
        carton: '680 Cartons per 40ft',
        images: ['Fourway-Pack-Seaweed-big.jpg', 'Fourway-Pack-Seaweed-thumb.jpg']},
    { name: 'Fourway 3 Angle Seaweed Crackers (30 bags)',
        size: '30 bags x 3pkts x 25g',
        carton: '680 Cartons per 40ft',
        images: ['Fourway-Pack-Seaweed-big.jpg', 'Fourway-Pack-Seaweed-thumb.jpg']},
    { name: 'Sarawak Laksa (Goreng)',
        size: '14 bags x 300g',
        carton: '2700 Cartons per 40ft',
        images: ['Laksa-Goreng-big.jpg', 'Laksa-Goreng-thumb.jpg']},
    { name: 'Fourway Sarawak Laksa Keropok 50g',
        size: '8 bags x 10pkts x 50g',
        carton: '400 Cartons per 40ft',
        images: ['Laksa-Keropok-50g-big.jpg', 'Laksa-Keropok-50g-thumb.jpg']},
    { name: 'Fourway Sarawak Laksa Keropok 100g',
        size: '30 bags x 100g',
        carton: '500 / 1200 Cartons per 40ft',
        images: ['Laksa-Keropok-100g-big.jpg', 'Laksa-Keropok-100g-thumb.jpg']},
    { name: 'Lee Fah Mee Abalone & Chicken Flavour Noodle',
        size: '30pkts x 70g',
        carton: '5560 / 2500 Cartons per 40ft',
        images: ['Lee-Fah-Mee-Abalone-Chicken-big.jpg', 'Lee-Fah-Mee-Abalone-Chicken-thumb.jpg']},
    { name: 'Lee Fah Mee Abalone & Chicken Flavour Noodle (12 bags)',
        size: '12 bags x 5pkts x 70g',
        carton: '5560 / 2500 Cartons / 40ft',
        images: ['Lee-Fah-Mee-Abalone-Chicken-big.jpg', 'Lee-Fah-Mee-Abalone-Chicken-thumb.jpg']},
    { name: 'Lee Fah Mee Abalone Chicken Flavour Rice Vermicelli',
        size: '15 bags x 280g',
        carton: '2500 Cartons per 40ft',
        images: ['Lee-Fah-Mee-Abalone-Chicken-noodle-big.jpg', 'Lee-Fah-Mee-Abalone-Chicken-noodle-thumb.jpg']},
    { name: 'Lee Fah Mee Beef Flavour Noodle',
        size: '30 pkts x 70g',
        carton: '5560 / 2500 Cartons per 40ft',
        images: ['Lee-Fah-Mee-Beef-big.jpg', 'Lee-Fah-Mee-Beef-thumb.jpg']},
    { name: 'Lee Fah Mee Beef Flavour Noodle (12 bags)',
        size: '12 bags x 5pkts x 70g',
        carton: '5560 / 2500 Cartons per 40ft',
        images: ['Lee-Fah-Mee-Beef-big.jpg', 'Lee-Fah-Mee-Beef-thumb.jpg']},
    { name: 'Lee Fah Mee Sarawak Bihun Laksa',
        size: '12 bags x 320g',
        carton: '2500 Cartons per 40ft',
        images: ['Lee-Fah-Mee-Bihun-Laksa-big.jpg', 'Lee-Fah-Mee-Bihun-Laksa-thumb.jpg']},
    { name: 'Lee Fah Mee Chicken Flavour Noodle',
        size: '30pkts x 70g',
        carton: '2500 Cartons per 40ft',
        images: ['Lee-Fah-Mee-Chicken-big.jpg', 'Lee-Fah-Mee-Chicken-thumb.jpg']},
    { name: 'Lee Fah Mee Chicken Flavour Noodle (12 bags)',
        size: '12 bags x 5pkts x 70g',
        carton: '2500 Cartons per 40ft',
        images: ['Lee-Fah-Mee-Chicken-big.jpg', 'Lee-Fah-Mee-Chicken-thumb.jpg']},
    { name: 'Lee Fah Mee Chicken & Mushroom Flavour Noodle',
        size: '30pkts x 70g',
        carton: '2500 Cartons per 40ft',
        images: ['Lee-Fah-Mee-Chicken-Mushroom-big.jpg', 'Lee-Fah-Mee-Chicken-Mushroom-thumb.jpg']},
    { name: 'Lee Fah Mee Chicken & Mushroom Flavour Noodle (12 bags)',
        size: '12 bags x 5pkts x 70g',
        carton: '2500 Cartons per 40ft',
        images: ['Lee-Fah-Mee-Chicken-Mushroom-big.jpg', 'Lee-Fah-Mee-Chicken-Mushroom-thumb.jpg']},
    { name: 'Lee Fah Mee Curry Flavour Noodle',
        size: '30pkts x 70g',
        carton: '5560 / 2500 Cartons per 40ft',
        images: ['Lee-Fah-Mee-Curry-big.jpg', 'Lee-Fah-Mee-Curry-thumb.jpg']},
    { name: 'Lee Fah Mee Curry Flavour Noodle (12 bags)',
        size: '12 bags x 5pkts x 70g',
        carton: '5560 / 2500 Cartons per 40ft',
        images: ['Lee-Fah-Mee-Curry-big.jpg', 'Lee-Fah-Mee-Curry-thumb.jpg']},
    { name: 'Lee Fah Mee Duck Flavour Noodle',
        size: '30pkts x 70g',
        carton: '5560 / 2500 Cartons per 40ft',
        images: ['Lee-Fah-Mee-Duck-big.jpg', 'Lee-Fah-Mee-Duck-thumb.jpg']},
    { name: 'Lee Fah Mee Duck Flavour Noodle (12 bags)',
        size: '12 bags x 5pkts x 70g',
        carton: '5560 / 2500 Cartons per 40ft',
        images: ['Lee-Fah-Mee-Duck-big.jpg', 'Lee-Fah-Mee-Duck-thumb.jpg']},
    { name: 'Lee Fah Mee Jawa Curry Flavour Noodle',
        size: '30 pkts x 70g',
        carton: '5560 / 2500 Cartons per 40ft',
        images: ['Lee-Fah-Mee-Jawa-Curry-big.jpg', 'Lee-Fah-Mee-Jawa-Curry-thumb.jpg']},
    { name: 'Lee Fah Mee Jawa Curry Flavour Noodle (12 bags)',
        size: '12 bags x 5pkts x 70g',
        carton: '5560 / 2500 Cartons per 40ft',
        images: ['Lee-Fah-Mee-Jawa-Curry-big.jpg', 'Lee-Fah-Mee-Jawa-Curry-thumb.jpg']},
    { name: 'Lee Fah Mee Laksa Flavour Noodle',
        size: '30pkts x 80g',
        carton: '5035 / 2500 Cartons per 40ft',
        images: ['Lee-Fah-Mee-Laksa-big.jpg', 'Lee-Fah-Mee-Laksa-thumb.jpg']},
    { name: 'Lee Fah Mee Laksa Flavour Noodle (12 bags)',
        size: '12 bags x 5pkts x 80g',
        carton: '5035 / 2500 Cartons per 40ft',
        images: ['Lee-Fah-Mee-Laksa-big.jpg', 'Lee-Fah-Mee-Laksa-thumb.jpg']},
    { name: 'Lee Fah Mee Vegetarian Flavour Noodle',
        size: '30pkts x 70g',
        carton: '5560 / 2500 Cartons per 40ft',
        images: ['Lee-Fah-Mee-Vegetarian-big.jpg', 'Lee-Fah-Mee-Vegetarian-thumb.jpg']},
    { name: 'Lee Fah Mee Vegetarian Flavour Noodle (12 bags)',
        size: '12 bags x 5pkts x 70g',
        carton: '5560 / 2500 Cartons per 40ft',
        images: ['Lee-Fah-Mee-Vegetarian-big.jpg', 'Lee-Fah-Mee-Vegetarian-thumb.jpg']},
    { name: 'Lee Fah Mee Vegetarian Curry Flavour Noodle',
        size: '30pkts x 70g',
        carton: '5560 / 2500 Cartons per 40ft',
        images: ['Lee-Fah-Mee-Vegetarian-Curry-big.jpg', 'Lee-Fah-Mee-Vegetarian-Curry-thumb.jpg']},
    { name: 'Lee Fah Mee Vegetarian Curry Flavour Noodle (12 bags)',
        size: '12 bags x 5pkts x 70g',
        carton: '5560 / 2500 Cartons per 40ft',
        images: ['Lee-Fah-Mee-Vegetarian-Curry-big.jpg', 'Lee-Fah-Mee-Vegetarian-Curry-thumb.jpg']},
    { name: 'Lee Fah Mee Sarawak White Curry Flavour Noodle',
        size: '12 bags x 5pkts x 90g',
        carton: '2000 Cartons per 40ft',
        images: ['Lee-Fah-Mee-White-Curry-big.jpg', 'Lee-Fah-Mee-White-Curry-thumb.jpg']},
    { name: 'Lee Fah Mee Sarawak White Laksa Flavour Noodle',
        size: '12 bags x 5pkts x 90g',
        carton: '2100 Cartons per 40ft',
        images: ['Lee-Fah-Mee-White-Laksa-big.jpg', 'Lee-Fah-Mee-White-Laksa-thumb.jpg']},
    { name: 'Lee Fah Mee Dried Noodle (Round Type)',
        size: '15pkts x 400g',
        carton: '1650 Cartons per 40ft',
        images: ['Long-Mee-big.jpg', 'Long-Mee-thumb.jpg']},
    { name: 'Masto Space Noodle Snack',
        size: '12 bags x 40pkts x 20g',
        carton: '500 Cartons per 40ft',
        images: ['Masto-Noodle-Snack-big.jpg', 'Masto-Noodle-Snack-thumb.jpg']},
    { name: 'Lee Fah Mee Meal Box Chicken Flavour',
        size: '24 boxes x 88g',
        carton: '955 Cartons per 20ft, 2000 Cartons per 40ft',
        images: ['Meal-Box-Chicken-big.jpg', 'Meal-Box-Chicken-thumb.jpg']},
    { name: 'Lee Fah Mee Meal Box Curry Flavour',
        size: '24 boxes x 88g',
        carton: '955 Cartons per 20ft, 2000 Cartons per 40ft',
        images: ['Meal-Box-Curry-big.jpg', 'Meal-Box-Curry-thumb.jpg']},
    { name: 'Lee Fah Mee Meal Box Sarawak Laksa Flavour',
        size: '24 boxes x 88g',
        carton: '955 Cartons per 20ft, 2000 Cartons per 40ft',
        images: ['Meal-Box-Laksa-big.jpg', 'Meal-Box-Laksa-thumb.jpg']},
    { name: 'Lee Fah Mee Meal Box Vegetarian Flavour',
        size: '24 boxes x 88g',
        carton: '955 Cartons per 20ft, 2000 Cartons per 40ft',
        images: ['Meal-Box-Vegetarian-big.jpg', 'Meal-Box-Vegetarian-thumb.jpg']},
    { name: 'Lee Fah Mee Meal Box Sarawak White Curry Flavour',
        size: '24 boxes x 88g',
        carton: '955 Cartons per 20ft, 2000 Cartons per 40ft',
        images: ['Meal-Box-White-Curry-big.jpg', 'Meal-Box-White-Curry-thumb.jpg']},
    { name: 'Lee Fah Mee Meal Box Sarawak White Laksa Flavour',
        size: '24 boxes x 88g',
        carton: '955 Cartons per 20ft, 2000 Cartons per 40ft',
        images: ['Meal-Box-White-Laksa-big.jpg', 'Meal-Box-White-Laksa-big.jpg']},
    { name: 'MIWON Dried Noodle (Flat Type)',
        size: '18pkts x 400g',
        carton: '640 / 1344 Cartons per 40ft',
        images: ['Miwon-big.jpg', 'Miwon-thumb.jpg']},
    { name: 'Lee Fah Mee Sarawak Laksa Plus',
        size: '4 boxes x (24 sets x 27mg of Laksa and 1pc x 500mg of Rice Vermicelli)',
        carton: '2100 Carton / 20ft, 5000 Cartons / 40ft',
        images: ['Sarawak-Laksa-big.jpg', 'Sarawak-Laksa-thumb.jpg']},
    { name: 'Lee Fah Mee Sarawak Vegetarian Laksa Flavour',
        size: '12 bags x 4pkts x 90g',
        carton: '2500 Cartons per 40ft',
        images: ['Sarawak-Vegetarian-Laksa-big.jpg', 'Sarawak-Vegetarian-Laksa-thumb.jpg']},
    { name: 'Lee Fah Mee Seaweed Noodle Snack',
        size: '40pkts x 20g, 20 bags x 7pkts x 20g',
        carton: '7000 / 1800 Cartons per 20ft',
        images: ['Seaweed-Noodle-Snack-big.jpg', 'Seaweed-Noodle-Snack-thumb.jpg']},
    { name: 'Lee Fah Mee Snek Mi Perisa Udang',
        size: '40pkts x 20g, 20 bags x 8pkts x 20g',
        carton: '7000 / 1300 Cartons per 20ft',
        images: ['Snek-Mi-Udang-big.jpg', 'Snek-Mi-Udang-thumb.jpg']},
];




export const update = async () => {

    i(`running scripts in ${__filename}`);

    await runImport();

    i(`done running update on ${__filename}`);
};

const runImport = async () => {
    // create view
    const viewName = 'Lee Fah Mee';
    let view: View = await getViewByName(viewName);
    if (!view) {
        const errors: string[] = await addOrUpdateViews([
            {
                id: -1,
                name: viewName,
                description: `${viewName} description`,
            } as View
        ]);
        checkErrors(errors, `Failed to create ${viewName} view`);
        view = await getViewByName(viewName);
    }

    // create attributes
    let attributes: Attribute[] = await getAttributesInView(view.id);
    if (!attributes || !attributes.length) {
        const errors: string[] = await saveAttributes(view.id, [
            {
                id: -1,
                name: `Size`,
                type: 'string',
                description: 'Size description'
            }  as Attribute,
            {
                id: -1,
                name: `Carton`,
                type: 'string',
                description: 'Carton description'
            } as Attribute,
        ], (level, msg) => l(level, msg));
        checkErrors(errors, `Failed ot create attributes for Cars view`);
        attributes = await getAttributesInView(view.id);
    }


    // create items & images for all files
    const sizeAttribute: Attribute = await getAttributeInViewByName(view.id, 'Size');
    const cartonAttribute: Attribute = await getAttributeInViewByName(view.id, 'Carton');
    const pathToAssetsDir: string = Path.join(__dirname, '../assets/leefahmee-data-images');
    for (const m of MAPPING) {
        const errs: string[] = await addItem(view.id, {
           id: -1,
           name: m.name,
           description: `${m.name} description`,
           [sizeAttribute.id]: m.size,
           [cartonAttribute.id]: m.carton
        } as Item);
        checkErrors(errs, `Failed to create item ${m.name}`);

        const item: Item = await getItemByName(view.id, m.name);
        checkNotNull(item, `Cannot find item ${m.name}`);

        let i = 0;
        for (const img of m.images) {
            i++
            const filePath = Path.join(pathToAssetsDir, img);
            const r: boolean = await addItemImage(
                item.id,
                img,
                await util.promisify(fs.readFile)(filePath),
                i === 0);
            checkTrue(r, `Failed to add image ${img} to item ${m.name}`);
        }
    }
};
