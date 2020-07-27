import {Item, ItemImage} from "../../src/model/item.model";
import {
    addItemImage, deleteItemImage,
    getItemById,
    getItemByName, getItemImageContent,
    getItemPrimaryImage,
    getUserByUsername,
    markItemImageAsPrimary
} from "../../src/service";
import * as util from "util";
import {JASMINE_TIMEOUT, setupBeforeAll, setupTestDatabase} from "../helpers/test-helper";
import {BinaryContent} from "../../src/model/binary-content.model";
import * as fs from "fs";
import {pathToFileURL} from "url";
import * as path from "path";

describe('item-image.service', () => {

    const viewId = 2;
    let item1: Item;

    beforeAll(() => {
        setupTestDatabase();
    });
    beforeAll((done: DoneFn) => {
        setupBeforeAll(done);
    }, JASMINE_TIMEOUT);
    
    beforeAll(async () => {
        item1 = await getItemByName(viewId, 'Item-1');
    });

    it('mark and check primary image', async () => {
        const imageId: number = item1.images[1].id;
        const errors: string[] = await markItemImageAsPrimary(item1.id, imageId);
        const content: BinaryContent = await getItemPrimaryImage(item1.id);
        const content2: BinaryContent = await getItemImageContent(imageId);
        
        expect(errors.length).toBe(0);
        expect(content).toBeDefined();
        expect(content2).toBeDefined();
        
        const i: Item = await getItemById(viewId, item1.id);
        const im: ItemImage = await i.images.find((img: ItemImage) => img.primary);
        
        expect(im).toBeDefined();
        expect(im.mimeType).toBeDefined();
        expect(im.primary).toBe(true);
        expect(im.id).toBe(imageId);
    });
    
    it('add and remove item image', async () => {
        const b: Buffer = await util.promisify(fs.readFile)(path.join(__dirname, 'image-assets', 'pizza.jpeg'));
        const r1 = await addItemImage(item1.id, 'xxxx', b, true);
        
        expect(r1).toBeTrue();

        const i1: Item = await getItemById(viewId, item1.id);
        const im1: ItemImage = await i1.images.find((img: ItemImage) => img.primary);
        
        expect(im1).toBeDefined();
        expect(im1.name).toBe('xxxx');
        
        const r2 = await deleteItemImage(item1.id, im1.id);

        expect(r2).toBeTrue();

        const i2: Item = await getItemById(viewId, item1.id);
        const im2: ItemImage = await i2.images.find((img: ItemImage) => img.id == im1.id);

        expect(im2).toBeFalsy();
    });
});