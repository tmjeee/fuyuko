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
import {
    addCategory,
    AddCategoryInput,
    addItem,
    addItemImage, addItemToPricingStructure, addItemToViewCateogry, addOrUpdatePricingStructures, addOrUpdateRules,
    getItemByName, getPricingStructureByName,
    getViewCategoryByName, setPrices
} from "../../service";
import {Item} from "../../model/item.model";
import {createNewItem} from "../../shared-utils/ui-item-value-creator.utils";
import {Rule, ValidateClause} from "../../model/rule.model";
import {AddOrUpdatePricingStructureInput} from "../../service/pricing-structure.service";
import {PricingStructure} from "../../model/pricing-structure.model";

export const profiles = [UPDATER_PROFILE_LEEFAHMEE_DATA];

const CATEGORY_NOODLE = 'Lee Fah Mee Noodle';
const CATEGORY_RICE_VERMICELLI = 'Lee Fah Mee Rice Vermicelli';
const CATEGORY_DRIED_NOODLE = 'Lee Fah Mee Dried Noodle';
const CATEGORY_MEAL_BOX = 'Lee Fah Mee Meal Box';
const CATEGORY_NOODLE_SNACK = 'Lee Fah Mee Noodle Snack';
const CATEGORY_FOURWAY_SNACK = 'Fourway Snack Food';

const CATEGORIES: any = [
    CATEGORY_NOODLE,
    CATEGORY_RICE_VERMICELLI,
    CATEGORY_DRIED_NOODLE,
    CATEGORY_MEAL_BOX,
    CATEGORY_NOODLE_SNACK,
    CATEGORY_FOURWAY_SNACK,
];


const MAPPING: any = [
    { name: 'Lee Fah Mee Sarawak Laksa',
        size: '12 bags x 320g',
        carton: '2500 cartons per 40ft',
        category: CATEGORY_RICE_VERMICELLI,
        price: 10.00, country: 'AUD',
        images: ['Bihun-Laksa-80g-big.jpg', 'Bihun-Laksa-80g-thumb.jpg'] },
    { name: 'Lee Fah Mee Chlorella Ramen',
        size: '12 pkts x 408g',
        carton: '1051 / 2210 cartons per 40ft',
        category: CATEGORY_DRIED_NOODLE,
        price: 10.00, country: 'AUD',
        images: ['Chlorella-Ramen-big.jpg', 'Chlorella-Ramen-thumb.jpg']},
    { name: 'Lee Fah Mee Dried Noodle Round',
        size: '30 pkts x 200g',
        carton: '2140 cartons per 40ft',
        category: CATEGORY_DRIED_NOODLE,
        price: 10.00, country: 'AUD',
        images: ['Dried-Noodle-Round-big.jpg', 'Dried-Noodle-Round-thumb.jpg']},
    { name: 'Lee Fah Mee Easy-2 Cook Jumbo Pack',
        size: '12 pkts x 408g',
        carton: '1051 / 2210 cartons per 40ft',
        category: CATEGORY_DRIED_NOODLE,
        price: 10.00, country: 'AUD',
        images: ['Easy-2-Cook-big.jpg', 'Easy-2-Cook-thumb.jpg']},
    { name: 'Lee Fah Mee Dried Noodle Flat Type',
        size: '30pkts x 200g',
        carton: '2140 cartons per 40ft',
        category: CATEGORY_DRIED_NOODLE,
        price: 10.00, country: 'AUD',
        images: ['Flat-Mee-Pack-big.jpg', 'Flat-Mee-Pack-thumb.jpg']},
    { name: 'Fourway Borneo Hot & Spicy Keropok',
        size: '8 bags x 10 pkts x 45g',
        carton: '400 cartons per 40ft',
        category: CATEGORY_FOURWAY_SNACK,
        price: 10.00, country: 'AUD',
        images: ['Fourway-Borneo-Hot-Spicy-Keropok-big.jpg', 'Fourway-Borneo-Hot-Spicy-Keropok-thumb.jpg']},
    { name: 'Fourway Borneo Prawn Keropok',
        size: '8 bags x 10 pkts x 45g',
        carton: '400 cartons per 40ft',
        category: CATEGORY_FOURWAY_SNACK,
        price: 10.00, country: 'AUD',
        images: ['Fourway-Borneo-Prawn-big.jpg', 'Fourway-Borneo-Prawn-thumb.jpg']},
    { name: 'Fourway Fish Crackers Original Flavour (20 bags)',
        size: '20 bags x 30 pkts x 15g',
        carton: '322 / 680 Cartons per 40ft',
        category: CATEGORY_FOURWAY_SNACK,
        price: 10.00, country: 'AUD',
        images: ['Fourway-Fish-Crackers-Original-big.jpg', 'Fourway-Fish-Crackers-Original-thumb.jpg']},
    { name: 'Fourway Fish Crackers Original Flavour (30 bags)',
        size: '30 bags x 6 pkts x 15g',
        carton: '322 / 680 Cartons per 40ft',
        category: CATEGORY_FOURWAY_SNACK,
        price: 10.00, country: 'AUD',
        images: ['Fourway-Fish-Crackers-Original-big.jpg', 'Fourway-Fish-Crackers-Original-thumb.jpg']},
    { name: 'Fourway Fish Crackers Seaweed Flavour (20 bags)',
        size: '20 bags x 30 pkts x 15g',
        carton: '322 / 680 Cartons per 40ft',
        category: CATEGORY_FOURWAY_SNACK,
        price: 10.00, country: 'AUD',
        images: ['Fourway-Fish-Crackers-Seaweed-big.jpg', 'Fourway-Fish-Crackers-Seaweed-thumb.jpg']},
    { name: 'Fourway Fish Crackers Seaweed Flavour (30 bags)',
        size: '30 bags x 6 pkts x 15g',
        carton: '322 / 680 Cartons per 40ft',
        category: CATEGORY_FOURWAY_SNACK,
        price: 10.00, country: 'AUD',
        images: ['Fourway-Fish-Crackers-Seaweed-big.jpg', 'Fourway-Fish-Crackers-Seaweed-thumb.jpg']},
    { name: 'Fourway Biskut Ikan Bilis (Anchovy Crackers)',
        size: '8 bags x 10 pkts x 110g',
        carton: '680 Cartons / 40ft',
        category: CATEGORY_FOURWAY_SNACK,
        price: 10.00, country: 'AUD',
        images: ['Fourway-Ikan-Bilis-big.jpg', 'Fourway-Ikan-Bilis-thumb.jpg']},
    { name: 'Fourway Cheese Cracker Chip (8 bags)',
        size: '8 bags x 10 pkts x 110g',
        carton: '680 Cartons per 40ft',
        category: CATEGORY_FOURWAY_SNACK,
        price: 10.00, country: 'AUD',
        images: ['Fourway-Pack-Cheese-big.jpg', 'Fourway-Pack-Cheese-thumb.jpg']},
    { name: 'Fourway Cheese Cracker Chip (6 bags)',
        size: '6 bags x 30 pkts x 45g',
        carton: '680 Cartons per 40ft',
        category: CATEGORY_FOURWAY_SNACK,
        price: 10.00, country: 'AUD',
        images: ['Fourway-Pack-Cheese-big.jpg', 'Fourway-Pack-Cheese-thumb.jpg']},
    { name: 'Fourway Cheese Cracker Chip (30 bags)',
        size: '30 bags x 5 pkts x 45g',
        carton: '680 Cartons per 40ft',
        category: CATEGORY_FOURWAY_SNACK,
        price: 10.00, country: 'AUD',
        images: ['Fourway-Pack-Cheese-big.jpg', 'Fourway-Pack-Cheese-thumb.jpg']},
    { name: 'Fourway Crab Crackers Chip (8 bags)',
        size: '8 bags x 10 pkts x 110g',
        carton: '680 Cartons per 40ft',
        category: CATEGORY_FOURWAY_SNACK,
        price: 10.00, country: 'AUD',
        images: ['Fourway-Pack-Crab-big.jpg', 'Fourway-Pack-Crab-thumb.jpg']},
    { name: 'Fourway Crab Crackers Chip (6 bags)',
        size: '6 bags x 30 pkts x 45g',
        carton: '680 Cartons per 40ft',
        category: CATEGORY_FOURWAY_SNACK,
        price: 10.00, country: 'AUD',
        images: ['Fourway-Pack-Crab-big.jpg', 'Fourway-Pack-Crab-thumb.jpg']},
    { name: 'Fourway Crab Crackers Chip (30 bags)',
        size: '30 bags x 5 pkts x 45g',
        carton: '680 Cartons per 40ft',
        category: CATEGORY_FOURWAY_SNACK,
        price: 10.00, country: 'AUD',
        images: ['Fourway-Pack-Crab-big.jpg', 'Fourway-Pack-Crab-thumb.jpg']},
    { name: 'Fourway 3 Angle Seaweed Crackers (8 bags)',
        size: '8 bags x 10pkts x 60g',
        carton: '680 Cartons per 40ft',
        category: CATEGORY_FOURWAY_SNACK,
        price: 10.00, country: 'AUD',
        images: ['Fourway-Pack-Seaweed-big.jpg', 'Fourway-Pack-Seaweed-thumb.jpg']},
    { name: 'Fourway 3 Angle Seaweed Crackers (6 bags)',
        size: '6 bags x 30pkts x 25g',
        carton: '680 Cartons per 40ft',
        category: CATEGORY_FOURWAY_SNACK,
        price: 10.00, country: 'AUD',
        images: ['Fourway-Pack-Seaweed-big.jpg', 'Fourway-Pack-Seaweed-thumb.jpg']},
    { name: 'Fourway 3 Angle Seaweed Crackers (30 bags)',
        size: '30 bags x 3pkts x 25g',
        carton: '680 Cartons per 40ft',
        category: CATEGORY_FOURWAY_SNACK,
        price: 10.00, country: 'AUD',
        images: ['Fourway-Pack-Seaweed-big.jpg', 'Fourway-Pack-Seaweed-thumb.jpg']},
    { name: 'Sarawak Laksa (Goreng)',
        size: '14 bags x 300g',
        carton: '2700 Cartons per 40ft',
        category: CATEGORY_RICE_VERMICELLI,
        price: 10.00, country: 'AUD',
        images: ['Laksa-Goreng-big.jpg', 'Laksa-Goreng-thumb.jpg']},
    { name: 'Fourway Sarawak Laksa Keropok 50g',
        size: '8 bags x 10pkts x 50g',
        carton: '400 Cartons per 40ft',
        category: CATEGORY_FOURWAY_SNACK,
        price: 10.00, country: 'AUD',
        images: ['Laksa-Keropok-50g-big.jpg', 'Laksa-Keropok-50g-thumb.jpg']},
    { name: 'Fourway Sarawak Laksa Keropok 100g',
        size: '30 bags x 100g',
        carton: '500 / 1200 Cartons per 40ft',
        category: CATEGORY_FOURWAY_SNACK,
        price: 10.00, country: 'AUD',
        images: ['Laksa-Keropok-100g-big.jpg', 'Laksa-Keropok-100g-thumb.jpg']},
    { name: 'Lee Fah Mee Abalone & Chicken Flavour Noodle',
        size: '30pkts x 70g',
        category: CATEGORY_NOODLE,
        carton: '5560 / 2500 Cartons per 40ft',
        price: 10.00, country: 'AUD',
        images: ['Lee-Fah-Mee-Abalone-Chicken-big.jpg', 'Lee-Fah-Mee-Abalone-Chicken-thumb.jpg']},
    { name: 'Lee Fah Mee Abalone & Chicken Flavour Noodle (12 bags)',
        size: '12 bags x 5pkts x 70g',
        carton: '5560 / 2500 Cartons / 40ft',
        category: CATEGORY_NOODLE,
        price: 10.00, country: 'AUD',
        images: ['Lee-Fah-Mee-Abalone-Chicken-big.jpg', 'Lee-Fah-Mee-Abalone-Chicken-thumb.jpg']},
    { name: 'Lee Fah Mee Abalone Chicken Flavour Rice Vermicelli',
        size: '15 bags x 280g',
        category: CATEGORY_RICE_VERMICELLI,
        carton: '2500 Cartons per 40ft',
        price: 10.00, country: 'AUD',
        images: ['Lee-Fah-Mee-Abalone-Chicken-noodle-big.jpg', 'Lee-Fah-Mee-Abalone-Chicken-noodle-thumb.jpg']},
    { name: 'Lee Fah Mee Beef Flavour Noodle',
        size: '30 pkts x 70g',
        carton: '5560 / 2500 Cartons per 40ft',
        category: CATEGORY_NOODLE,
        price: 10.00, country: 'AUD',
        images: ['Lee-Fah-Mee-Beef-big.jpg', 'Lee-Fah-Mee-Beef-thumb.jpg']},
    { name: 'Lee Fah Mee Beef Flavour Noodle (12 bags)',
        size: '12 bags x 5pkts x 70g',
        carton: '5560 / 2500 Cartons per 40ft',
        category: CATEGORY_NOODLE,
        price: 10.00, country: 'AUD',
        images: ['Lee-Fah-Mee-Beef-big.jpg', 'Lee-Fah-Mee-Beef-thumb.jpg']},
    { name: 'Lee Fah Mee Sarawak Bihun Laksa',
        size: '12 bags x 320g',
        carton: '2500 Cartons per 40ft',
        category: CATEGORY_RICE_VERMICELLI,
        price: 10.00, country: 'AUD',
        images: ['Lee-Fah-Mee-Bihun-Laksa-big.jpg', 'Lee-Fah-Mee-Bihun-Laksa-thumb.jpg']},
    { name: 'Lee Fah Mee Chicken Flavour Noodle',
        size: '30pkts x 70g',
        carton: '2500 Cartons per 40ft',
        category: CATEGORY_NOODLE,
        price: 10.00, country: 'AUD',
        images: ['Lee-Fah-Mee-Chicken-big.jpg', 'Lee-Fah-Mee-Chicken-thumb.jpg']},
    { name: 'Lee Fah Mee Chicken Flavour Noodle (12 bags)',
        size: '12 bags x 5pkts x 70g',
        carton: '2500 Cartons per 40ft',
        category: CATEGORY_NOODLE,
        price: 10.00, country: 'AUD',
        images: ['Lee-Fah-Mee-Chicken-big.jpg', 'Lee-Fah-Mee-Chicken-thumb.jpg']},
    { name: 'Lee Fah Mee Chicken & Mushroom Flavour Noodle',
        size: '30pkts x 70g',
        carton: '2500 Cartons per 40ft',
        category: CATEGORY_NOODLE,
        price: 10.00, country: 'AUD',
        images: ['Lee-Fah-Mee-Chicken-Mushroom-big.jpg', 'Lee-Fah-Mee-Chicken-Mushroom-thumb.jpg']},
    { name: 'Lee Fah Mee Chicken & Mushroom Flavour Noodle (12 bags)',
        size: '12 bags x 5pkts x 70g',
        carton: '2500 Cartons per 40ft',
        category: CATEGORY_NOODLE,
        price: 10.00, country: 'AUD',
        images: ['Lee-Fah-Mee-Chicken-Mushroom-big.jpg', 'Lee-Fah-Mee-Chicken-Mushroom-thumb.jpg']},
    { name: 'Lee Fah Mee Curry Flavour Noodle',
        size: '30pkts x 70g',
        carton: '5560 / 2500 Cartons per 40ft',
        category: CATEGORY_NOODLE,
        price: 10.00, country: 'AUD',
        images: ['Lee-Fah-Mee-Curry-big.jpg', 'Lee-Fah-Mee-Curry-thumb.jpg']},
    { name: 'Lee Fah Mee Curry Flavour Noodle (12 bags)',
        size: '12 bags x 5pkts x 70g',
        carton: '5560 / 2500 Cartons per 40ft',
        category: CATEGORY_NOODLE,
        price: 10.00, country: 'AUD',
        images: ['Lee-Fah-Mee-Curry-big.jpg', 'Lee-Fah-Mee-Curry-thumb.jpg']},
    { name: 'Lee Fah Mee Duck Flavour Noodle',
        size: '30pkts x 70g',
        carton: '5560 / 2500 Cartons per 40ft',
        category: CATEGORY_NOODLE,
        price: 10.00, country: 'AUD',
        images: ['Lee-Fah-Mee-Duck-big.jpg', 'Lee-Fah-Mee-Duck-thumb.jpg']},
    { name: 'Lee Fah Mee Duck Flavour Noodle (12 bags)',
        size: '12 bags x 5pkts x 70g',
        carton: '5560 / 2500 Cartons per 40ft',
        category: CATEGORY_NOODLE,
        price: 10.00, country: 'AUD',
        images: ['Lee-Fah-Mee-Duck-big.jpg', 'Lee-Fah-Mee-Duck-thumb.jpg']},
    { name: 'Lee Fah Mee Jawa Curry Flavour Noodle',
        size: '30 pkts x 70g',
        carton: '5560 / 2500 Cartons per 40ft',
        category: CATEGORY_NOODLE,
        price: 10.00, country: 'AUD',
        images: ['Lee-Fah-Mee-Jawa-Curry-big.jpg', 'Lee-Fah-Mee-Jawa-Curry-thumb.jpg']},
    { name: 'Lee Fah Mee Jawa Curry Flavour Noodle (12 bags)',
        size: '12 bags x 5pkts x 70g',
        carton: '5560 / 2500 Cartons per 40ft',
        category: CATEGORY_NOODLE,
        price: 10.00, country: 'AUD',
        images: ['Lee-Fah-Mee-Jawa-Curry-big.jpg', 'Lee-Fah-Mee-Jawa-Curry-thumb.jpg']},
    { name: 'Lee Fah Mee Laksa Flavour Noodle',
        size: '30pkts x 80g',
        carton: '5035 / 2500 Cartons per 40ft',
        category: CATEGORY_NOODLE,
        price: 10.00, country: 'AUD',
        images: ['Lee-Fah-Mee-Laksa-big.jpg', 'Lee-Fah-Mee-Laksa-thumb.jpg']},
    { name: 'Lee Fah Mee Laksa Flavour Noodle (12 bags)',
        size: '12 bags x 5pkts x 80g',
        carton: '5035 / 2500 Cartons per 40ft',
        category: CATEGORY_RICE_VERMICELLI,
        price: 10.00, country: 'AUD',
        images: ['Lee-Fah-Mee-Laksa-big.jpg', 'Lee-Fah-Mee-Laksa-thumb.jpg']},
    { name: 'Lee Fah Mee Vegetarian Flavour Noodle',
        size: '30pkts x 70g',
        carton: '5560 / 2500 Cartons per 40ft',
        category: CATEGORY_NOODLE,
        price: 10.00, country: 'AUD',
        images: ['Lee-Fah-Mee-Vegetarian-big.jpg', 'Lee-Fah-Mee-Vegetarian-thumb.jpg']},
    { name: 'Lee Fah Mee Vegetarian Flavour Noodle (12 bags)',
        size: '12 bags x 5pkts x 70g',
        carton: '5560 / 2500 Cartons per 40ft',
        category: CATEGORY_NOODLE,
        price: 10.00, country: 'AUD',
        images: ['Lee-Fah-Mee-Vegetarian-big.jpg', 'Lee-Fah-Mee-Vegetarian-thumb.jpg']},
    { name: 'Lee Fah Mee Vegetarian Curry Flavour Noodle',
        size: '30pkts x 70g',
        carton: '5560 / 2500 Cartons per 40ft',
        category: CATEGORY_NOODLE,
        price: 10.00, country: 'AUD',
        images: ['Lee-Fah-Mee-Vegetarian-Curry-big.jpg', 'Lee-Fah-Mee-Vegetarian-Curry-thumb.jpg']},
    { name: 'Lee Fah Mee Vegetarian Curry Flavour Noodle (12 bags)',
        size: '12 bags x 5pkts x 70g',
        carton: '5560 / 2500 Cartons per 40ft',
        category: CATEGORY_NOODLE,
        price: 10.00, country: 'AUD',
        images: ['Lee-Fah-Mee-Vegetarian-Curry-big.jpg', 'Lee-Fah-Mee-Vegetarian-Curry-thumb.jpg']},
    { name: 'Lee Fah Mee Sarawak White Curry Flavour Noodle',
        size: '12 bags x 5pkts x 90g',
        carton: '2000 Cartons per 40ft',
        category: CATEGORY_NOODLE,
        price: 10.00, country: 'AUD',
        images: ['Lee-Fah-Mee-White-Curry-big.jpg', 'Lee-Fah-Mee-White-Curry-thumb.jpg']},
    { name: 'Lee Fah Mee Sarawak White Laksa Flavour Noodle',
        size: '12 bags x 5pkts x 90g',
        carton: '2100 Cartons per 40ft',
        category: CATEGORY_RICE_VERMICELLI,
        price: 10.00, country: 'AUD',
        images: ['Lee-Fah-Mee-White-Laksa-big.jpg', 'Lee-Fah-Mee-White-Laksa-thumb.jpg']},
    { name: 'Lee Fah Mee Dried Noodle (Round Type)',
        size: '15pkts x 400g',
        carton: '1650 Cartons per 40ft',
        category: CATEGORY_DRIED_NOODLE,
        price: 10.00, country: 'AUD',
        images: ['Long-Mee-big.jpg', 'Long-Mee-thumb.jpg']},
    { name: 'Masto Space Noodle Snack',
        size: '12 bags x 40pkts x 20g',
        carton: '500 Cartons per 40ft',
        category: CATEGORY_NOODLE_SNACK,
        price: 10.00, country: 'AUD',
        images: ['Masto-Noodle-Snack-big.jpg', 'Masto-Noodle-Snack-thumb.jpg']},
    { name: 'Lee Fah Mee Meal Box Chicken Flavour',
        size: '24 boxes x 88g',
        carton: '955 Cartons per 20ft, 2000 Cartons per 40ft',
        category: CATEGORY_MEAL_BOX,
        price: 10.00, country: 'AUD',
        images: ['Meal-Box-Chicken-big.jpg', 'Meal-Box-Chicken-thumb.jpg']},
    { name: 'Lee Fah Mee Meal Box Curry Flavour',
        size: '24 boxes x 88g',
        carton: '955 Cartons per 20ft, 2000 Cartons per 40ft',
        category: CATEGORY_MEAL_BOX,
        price: 10.00, country: 'AUD',
        images: ['Meal-Box-Curry-big.jpg', 'Meal-Box-Curry-thumb.jpg']},
    { name: 'Lee Fah Mee Meal Box Sarawak Laksa Flavour',
        size: '24 boxes x 88g',
        carton: '955 Cartons per 20ft, 2000 Cartons per 40ft',
        category: CATEGORY_MEAL_BOX,
        price: 10.00, country: 'AUD',
        images: ['Meal-Box-Laksa-big.jpg', 'Meal-Box-Laksa-thumb.jpg']},
    { name: 'Lee Fah Mee Meal Box Vegetarian Flavour',
        size: '24 boxes x 88g',
        carton: '955 Cartons per 20ft, 2000 Cartons per 40ft',
        category: CATEGORY_MEAL_BOX,
        price: 10.00, country: 'AUD',
        images: ['Meal-Box-Vegetarian-big.jpg', 'Meal-Box-Vegetarian-thumb.jpg']},
    { name: 'Lee Fah Mee Meal Box Sarawak White Curry Flavour',
        size: '24 boxes x 88g',
        carton: '955 Cartons per 20ft, 2000 Cartons per 40ft',
        category: CATEGORY_MEAL_BOX,
        price: 10.00, country: 'AUD',
        images: ['Meal-Box-White-Curry-big.jpg', 'Meal-Box-White-Curry-thumb.jpg']},
    { name: 'Lee Fah Mee Meal Box Sarawak White Laksa Flavour',
        size: '24 boxes x 88g',
        carton: '955 Cartons per 20ft, 2000 Cartons per 40ft',
        category: CATEGORY_MEAL_BOX,
        price: 10.00, country: 'AUD',
        images: ['Meal-Box-White-Laksa-big.jpg', 'Meal-Box-White-Laksa-big.jpg']},
    { name: 'MIWON Dried Noodle (Flat Type)',
        size: '18pkts x 400g',
        carton: '640 / 1344 Cartons per 40ft',
        category: CATEGORY_DRIED_NOODLE,
        price: 10.00, country: 'AUD',
        images: ['Miwon-big.jpg', 'Miwon-thumb.jpg']},
    { name: 'Lee Fah Mee Sarawak Laksa Plus',
        size: '4 boxes x (24 sets x 27mg of Laksa and 1pc x 500mg of Rice Vermicelli)',
        carton: '2100 Carton / 20ft, 5000 Cartons / 40ft',
        category: CATEGORY_RICE_VERMICELLI,
        price: 10.00, country: 'AUD',
        images: ['Sarawak-Laksa-big.jpg', 'Sarawak-Laksa-thumb.jpg']},
    { name: 'Lee Fah Mee Sarawak Vegetarian Laksa Flavour',
        size: '12 bags x 4pkts x 90g',
        carton: '2500 Cartons per 40ft',
        category: CATEGORY_RICE_VERMICELLI,
        price: 10.00, country: 'AUD',
        images: ['Sarawak-Vegetarian-Laksa-big.jpg', 'Sarawak-Vegetarian-Laksa-thumb.jpg']},
    { name: 'Lee Fah Mee Seaweed Noodle Snack',
        size: '40pkts x 20g, 20 bags x 7pkts x 20g',
        carton: '7000 / 1800 Cartons per 20ft',
        category: CATEGORY_NOODLE_SNACK,
        price: 10.00, country: 'AUD',
        images: ['Seaweed-Noodle-Snack-big.jpg', 'Seaweed-Noodle-Snack-thumb.jpg']},
    { name: 'Lee Fah Mee Snek Mi Perisa Udang',
        size: '40pkts x 20g, 20 bags x 8pkts x 20g',
        carton: '7000 / 1300 Cartons per 20ft',
        category: CATEGORY_NOODLE_SNACK,
        price: 10.00, country: 'AUD',
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

    // create categories
    for (const category of CATEGORIES) {
        await addCategory(view.id, null, {
            name: category,
            description: category,
            children: []
        } as AddCategoryInput)
    }
    const categoryNoodle = await getViewCategoryByName(view.id, CATEGORY_NOODLE);
    checkNotNull(categoryNoodle, `Failed to create category noodle`);
    const categoryRiceVermicelli = await getViewCategoryByName(view.id, CATEGORY_RICE_VERMICELLI);
    checkNotNull(categoryRiceVermicelli, `Failed to create category rice vermicelli`);
    const categoryDriedNoodle = await getViewCategoryByName(view.id, CATEGORY_DRIED_NOODLE);
    checkNotNull(categoryDriedNoodle, `Failed to create category dried noodle`);
    const categoryMealBox = await getViewCategoryByName(view.id, CATEGORY_MEAL_BOX);
    checkNotNull(categoryMealBox, `Failed to create category meal box`);
    const categoryNoodleSnack = await getViewCategoryByName(view.id, CATEGORY_NOODLE_SNACK);
    checkNotNull(categoryNoodleSnack, `Failed to create category noodle snack`);
    const categoryFourwaySnack = await getViewCategoryByName(view.id, CATEGORY_FOURWAY_SNACK);
    checkNotNull(categoryFourwaySnack, `Failed to create fourway snack`);

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

    // pricing
    const PRICING_STRUCTURE_NAME = `Lee Fah Mee Standard Pricing Structure`;
    const errs: string[] = await addOrUpdatePricingStructures([{
        id: -1, name: PRICING_STRUCTURE_NAME, description: 'Lee Fah Mee collections standard Pricing Structure', status: "ENABLED", viewId: view.id
    } as AddOrUpdatePricingStructureInput])
    checkErrors(errs, `Failed to create Lee Fah Mee pricing structure`);
    const pricingStructure: PricingStructure = await getPricingStructureByName(view.id, PRICING_STRUCTURE_NAME);
    checkNotNull(pricingStructure, `Failed to find pricing structure ${pricingStructure}`);

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

        switch(m.category) {
           case CATEGORY_NOODLE: {
               const err: string[] = await addItemToViewCateogry(categoryNoodle.id, item.id);
               checkErrors(err, `Failed to add item ${item.name} to category ${categoryNoodle.name}`);
               break;
           }
           case CATEGORY_RICE_VERMICELLI: {
               const err: string[] = await addItemToViewCateogry(categoryRiceVermicelli.id, item.id);
               checkErrors(err, `Failed to add item ${item.name} to category ${categoryNoodle.name}`);
               break;
           }
           case CATEGORY_DRIED_NOODLE: {
               const err: string[] = await addItemToViewCateogry(categoryDriedNoodle.id, item.id);
               checkErrors(err, `Failed to add item ${item.name} to category ${categoryNoodle.name}`);
               break;
           }
           case CATEGORY_MEAL_BOX: {
               const err: string[] = await addItemToViewCateogry(categoryMealBox.id, item.id);
               checkErrors(err, `Failed to add item ${item.name} to category ${categoryNoodle.name}`);
               break;
           }
           case CATEGORY_NOODLE_SNACK: {
               const err: string[] = await addItemToViewCateogry(categoryNoodleSnack.id, item.id);
               checkErrors(err, `Failed to add item ${item.name} to category ${categoryNoodle.name}`);
               break;
           }
           case CATEGORY_FOURWAY_SNACK: {
               const err: string[] = await addItemToViewCateogry(categoryFourwaySnack.id, item.id);
               checkErrors(err, `Failed to add item ${item.name} to category ${categoryNoodle.name}`);
               break;
           }
        }


        const r: boolean = await addItemToPricingStructure(view.id, pricingStructure.id, item.id);
        checkTrue(r, `Failed to add item ${item.name} with id ${item.id} to pricing structure ${pricingStructure.name} with id ${pricingStructure.id}`);

        const errs2: string[] = await setPrices([{
            pricingStructureId: pricingStructure.id,
            item: {price: m.price, itemId: item.id, country: m.country}
        }]);
        checkErrors(errs2, `Failed to set price for item id ${item.id} named ${item.name}`);


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


    // rules
    const err: string[] = await addOrUpdateRules(view.id, [
        {
           id: -1,
           name: 'size attriute value is not empty',
           description: 'validate size attribute value is not empty',
           status: "ENABLED",
           level: "ERROR",
           whenClauses: [],
           validateClauses: [
               {
                  id: -1,
                  attributeId:  sizeAttribute.id,
                  attributeName: sizeAttribute.name,
                  attributeType: sizeAttribute.type,
                  operator: "not empty"
               } as ValidateClause,
           ]
        } as Rule,
        {
            id: -1,
            name: 'carton attribute value is not empty',
            description: 'validate carton attribute value is not empty',
            status: "ENABLED",
            level: "ERROR",
            whenClauses: [],
            validateClauses: [
                {
                    id: -1,
                    attributeId:  cartonAttribute.id,
                    attributeName: cartonAttribute.name,
                    attributeType: cartonAttribute.type,
                    operator: "not empty"
                } as ValidateClause,
            ]
        } as Rule,
    ]);
    checkErrors(err, `Failed to create rules (for size and carton attributes)`);
};
