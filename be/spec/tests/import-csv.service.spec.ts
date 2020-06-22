import {readCsv, readKeyPairs, readPair1Csv, readPair2Csv} from "../../src/service/import-csv/import-csv.service";
import {Pair1, Pair2} from "../../src/model/attribute.model";
import {readFile} from "fs";
import * as util from "util";
import * as path from "path";
import {CsvAttribute, CsvItem, CsvPrice} from "../../src/server-side-model/server-side.model";


describe(`import-csv.service`, () => {
  it(`readKeyPairs`, () => {
    let kp = readKeyPairs(`one=two`);

    expect(kp.length).toBe(2);
    expect(kp[0]).toBe('one');
    expect(kp[1]).toBe('two');


    kp = readKeyPairs(`one = two`);

    expect(kp.length).toBe(2);
    expect(kp[0]).toBe('one');
    expect(kp[1]).toBe('two');
  });


  it(`readPair1Csv`, async () => {
    const p: Pair1[] = await readPair1Csv(`one|two| three | four=five| six = seven| eight= nine`);

    expect(p.length).toBe(3);
    expect(p[0].key).toBe(`four`);
    expect(p[0].value).toBe('five');
    expect(p[1].key).toBe('six');
    expect(p[1].value).toBe('seven');
    expect(p[2].key).toBe('eight');
    expect(p[2].value).toBe('nine');
  });


  it(`readPair2Csv`, async () => {
    const p: Pair2[] = await readPair2Csv(`one | two | three = four | five | six | seven = eight= nine| ten = eleven = twelve | xxx= sdsd = aaa`);


    expect(p.length).toBe(3);
    expect(p[0].key1).toBe('seven');
    expect(p[0].key2).toBe('eight');
    expect(p[0].value).toBe('nine');
    expect(p[1].key1).toBe('ten');
    expect(p[1].key2).toBe('eleven');
    expect(p[1].value).toBe('twelve');
    expect(p[2].key1).toBe('xxx');
    expect(p[2].key2).toBe('sdsd');
    expect(p[2].value).toBe('aaa');
  });

  it(`readCsv (attributes)`, async () => {
      const b: Buffer = await util.promisify(readFile)(path.join(__dirname, 'import-csv-service-assets', 'sample-import-attributes.csv'));
      const csvAttributes: CsvAttribute[] = await readCsv<CsvAttribute>(b);

      expect(csvAttributes).toBeDefined();
      expect(csvAttributes.length).toBe(14);

      // att01 string
      expect(csvAttributes[0].name).toBe('att01');
      expect(csvAttributes[0].description).toBe('att 01 description');
      expect(csvAttributes[0].type).toBe('string');
      expect(csvAttributes[0].format).toBe('');
      expect(csvAttributes[0].showCurrencyCountry).toBe('');
      expect(csvAttributes[0].pair1).toBe('');
      expect(csvAttributes[0].pair2).toBe('');

      // att02 text
      expect(csvAttributes[1].name).toBe('att02');
      expect(csvAttributes[1].description).toBe('att 02 description');
      expect(csvAttributes[1].type).toBe('text');
      expect(csvAttributes[1].format).toBe('');
      expect(csvAttributes[1].showCurrencyCountry).toBe('');
      expect(csvAttributes[1].pair1).toBe('');
      expect(csvAttributes[1].pair2).toBe('');

      // att03 number
      expect(csvAttributes[2].name).toBe('att03');
      expect(csvAttributes[2].description).toBe('att 03 description');
      expect(csvAttributes[2].type).toBe('number');
      expect(csvAttributes[2].format).toBe('0.0');
      expect(csvAttributes[2].showCurrencyCountry).toBe('');
      expect(csvAttributes[2].pair1).toBe('');
      expect(csvAttributes[2].pair2).toBe('');

      // att04 date
      expect(csvAttributes[3].name).toBe('att04');
      expect(csvAttributes[3].description).toBe('att 04 description');
      expect(csvAttributes[3].type).toBe('date');
      expect(csvAttributes[3].format).toBe('DD-MM-YYYY');
      expect(csvAttributes[3].showCurrencyCountry).toBe('');
      expect(csvAttributes[3].pair1).toBe('');
      expect(csvAttributes[3].pair2).toBe('');

      // att05 currency
      expect(csvAttributes[4].name).toBe('att05');
      expect(csvAttributes[4].description).toBe('att 05 description');
      expect(csvAttributes[4].type).toBe('currency');
      expect(csvAttributes[4].format).toBe('');
      expect(csvAttributes[4].showCurrencyCountry).toBe('true');
      expect(csvAttributes[4].pair1).toBe('');
      expect(csvAttributes[4].pair2).toBe('');

      // att06 volume
      expect(csvAttributes[5].name).toBe('att06');
      expect(csvAttributes[5].description).toBe('att 06 description');
      expect(csvAttributes[5].type).toBe('volume');
      expect(csvAttributes[5].format).toBe('0.0');
      expect(csvAttributes[5].showCurrencyCountry).toBe('');
      expect(csvAttributes[5].pair1).toBe('');
      expect(csvAttributes[5].pair2).toBe('');

      // att07 dimension
      expect(csvAttributes[6].name).toBe('att07');
      expect(csvAttributes[6].description).toBe('att 07 description');
      expect(csvAttributes[6].type).toBe('dimension');
      expect(csvAttributes[6].format).toBe('0.0');
      expect(csvAttributes[6].showCurrencyCountry).toBe('');
      expect(csvAttributes[6].pair1).toBe('');
      expect(csvAttributes[6].pair2).toBe('');

      // att08 area
      expect(csvAttributes[7].name).toBe('att08');
      expect(csvAttributes[7].description).toBe('att 08 description');
      expect(csvAttributes[7].type).toBe('area');
      expect(csvAttributes[7].format).toBe('0.0');
      expect(csvAttributes[7].showCurrencyCountry).toBe('');
      expect(csvAttributes[7].pair1).toBe('');
      expect(csvAttributes[7].pair2).toBe('');

      // att09 width
      expect(csvAttributes[8].name).toBe('att09');
      expect(csvAttributes[8].description).toBe('att 09 description');
      expect(csvAttributes[8].type).toBe('width');
      expect(csvAttributes[8].format).toBe('0.0');
      expect(csvAttributes[8].showCurrencyCountry).toBe('');
      expect(csvAttributes[8].pair1).toBe('');
      expect(csvAttributes[8].pair2).toBe('');

      // att10 length
      expect(csvAttributes[9].name).toBe('att10');
      expect(csvAttributes[9].description).toBe('att 10 description');
      expect(csvAttributes[9].type).toBe('length');
      expect(csvAttributes[9].format).toBe('0.0');
      expect(csvAttributes[9].showCurrencyCountry).toBe('');
      expect(csvAttributes[9].pair1).toBe('');
      expect(csvAttributes[9].pair2).toBe('');

      // att11 height
      expect(csvAttributes[10].name).toBe('att11');
      expect(csvAttributes[10].description).toBe('att 11 description');
      expect(csvAttributes[10].type).toBe('height');
      expect(csvAttributes[10].format).toBe('0.0');
      expect(csvAttributes[10].showCurrencyCountry).toBe('');
      expect(csvAttributes[10].pair1).toBe('');
      expect(csvAttributes[10].pair2).toBe('');

      // att12 select
      expect(csvAttributes[11].name).toBe('att12');
      expect(csvAttributes[11].description).toBe('att 12 description');
      expect(csvAttributes[11].type).toBe('select');
      expect(csvAttributes[11].format).toBe('');
      expect(csvAttributes[11].showCurrencyCountry).toBe('');
      expect(csvAttributes[11].pair1).toBe('key1=value1|key2=value2|key3=value3');
      expect(csvAttributes[11].pair2).toBe('');

      // att13 doubleselect
      expect(csvAttributes[12].name).toBe('att13');
      expect(csvAttributes[12].description).toBe('att 13 description');
      expect(csvAttributes[12].type).toBe('doubleselect');
      expect(csvAttributes[12].format).toBe('');
      expect(csvAttributes[12].showCurrencyCountry).toBe('');
      expect(csvAttributes[12].pair1).toBe('key1=value1|key2=value2|key3=value3');
      expect(csvAttributes[12].pair2).toBe('key1=xkey11=xvalue11|key1=xkey12=xvalue12|key2=xkey21=xvalue21|key2=xkey22=xvalue22|key3=xkey31=xvalue31|key3=xkey32=xvalue32');

      // att14 weight
      expect(csvAttributes[13].name).toBe('att14');
      expect(csvAttributes[13].description).toBe('att 14 description');
      expect(csvAttributes[13].type).toBe('weight');
      expect(csvAttributes[13].format).toBe('0.0');
      expect(csvAttributes[13].showCurrencyCountry).toBe('');
      expect(csvAttributes[13].pair1).toBe('');
      expect(csvAttributes[13].pair2).toBe('');
  });


  it(`readCsv (items)`, async () => {
      const b: Buffer = await util.promisify(readFile)(path.join(__dirname, 'import-csv-service-assets', 'sample-import-items.csv'));
      const csvItems: CsvItem[] = await readCsv<CsvItem>(b);

      expect(csvItems).toBeDefined();
      expect(csvItems.length).toBe(6);

      // item 1
      expect(csvItems[0].parentName).toBe('');
      expect(csvItems[0].name).toBe('item 1');
      expect(csvItems[0].description).toBe('item 1 description');
      expect(csvItems[0]['attName=att01']).toBe('some string');
      expect(csvItems[0]['attName=att02']).toBe('some text');
      expect(csvItems[0]['attName=att03']).toBe('10.0');
      expect(csvItems[0]['attId=17']).toBe('10-09-2018');
      expect(csvItems[0]['attName=att05']).toBe('23.50');
      expect(csvItems[0]['attName=att06']).toBe('11.11|l');
      expect(csvItems[0]['attName=att07']).toBe('12.01|13.01|14.01|m');
      expect(csvItems[0]['attName=att08']).toBe('11|m2');
      expect(csvItems[0]['attName=att09']).toBe('33|m');
      expect(csvItems[0]['attName=att10']).toBe('44|m');
      expect(csvItems[0]['attName=att11']).toBe('55|m');
      expect(csvItems[0]['attName=att12']).toBe('key2');
      expect(csvItems[0]['attName=att13']).toBe('key3|xkey31');
      expect(csvItems[0]['attName=att14']).toBe('10|kg');

      // item 1_1
      expect(csvItems[1].parentName).toBe('item 1');
      expect(csvItems[1].name).toBe('item 1_1');
      expect(csvItems[1].description).toBe('item 1_1 description');
      expect(csvItems[1]['attName=att01']).toBe('some string');
      expect(csvItems[1]['attName=att02']).toBe('some text');
      expect(csvItems[1]['attName=att03']).toBe('10.0');
      expect(csvItems[1]['attId=17']).toBe('10-09-2018');
      expect(csvItems[1]['attName=att05']).toBe('23.50');
      expect(csvItems[1]['attName=att06']).toBe('11.11|l');
      expect(csvItems[1]['attName=att07']).toBe('12.01|13.01|14.01|m');
      expect(csvItems[1]['attName=att08']).toBe('11|m2');
      expect(csvItems[1]['attName=att09']).toBe('33|m');
      expect(csvItems[1]['attName=att10']).toBe('44|m');
      expect(csvItems[1]['attName=att11']).toBe('55|m');
      expect(csvItems[1]['attName=att12']).toBe('key2');
      expect(csvItems[1]['attName=att13']).toBe('key3|xkey31');
      expect(csvItems[1]['attName=att14']).toBe('10|kg');

      // item 1_1_1
      expect(csvItems[2].parentName).toBe('item 1_1');
      expect(csvItems[2].name).toBe('item 1_1_1');
      expect(csvItems[2].description).toBe('item 1_1_1 description');
      expect(csvItems[2]['attName=att01']).toBe('some string');
      expect(csvItems[2]['attName=att02']).toBe('some text');
      expect(csvItems[2]['attName=att03']).toBe('10.0');
      expect(csvItems[2]['attId=17']).toBe('10-09-2018');
      expect(csvItems[2]['attName=att05']).toBe('23.50');
      expect(csvItems[2]['attName=att06']).toBe('11.11|l');
      expect(csvItems[2]['attName=att07']).toBe('12.01|13.01|14.01|m');
      expect(csvItems[2]['attName=att08']).toBe('11|m2');
      expect(csvItems[2]['attName=att09']).toBe('33|m');
      expect(csvItems[2]['attName=att10']).toBe('44|m');
      expect(csvItems[2]['attName=att11']).toBe('55|m');
      expect(csvItems[2]['attName=att12']).toBe('key2');
      expect(csvItems[2]['attName=att13']).toBe('key3|xkey31');
      expect(csvItems[2]['attName=att14']).toBe('10|kg');

      // item 1_1_1_1
      expect(csvItems[3].parentName).toBe('item 1_1_1');
      expect(csvItems[3].name).toBe('item 1_1_1_1');
      expect(csvItems[3].description).toBe('item 1_1_1_1 description');
      expect(csvItems[3]['attName=att01']).toBe('some string');
      expect(csvItems[3]['attName=att02']).toBe('some text');
      expect(csvItems[3]['attName=att03']).toBe('10.0');
      expect(csvItems[3]['attId=17']).toBe('10-09-2018');
      expect(csvItems[3]['attName=att05']).toBe('23.50');
      expect(csvItems[3]['attName=att06']).toBe('11.11|l');
      expect(csvItems[3]['attName=att07']).toBe('12.01|13.01|14.01|m');
      expect(csvItems[3]['attName=att08']).toBe('11|m2');
      expect(csvItems[3]['attName=att09']).toBe('33|m');
      expect(csvItems[3]['attName=att10']).toBe('44|m');
      expect(csvItems[3]['attName=att11']).toBe('55|m');
      expect(csvItems[3]['attName=att12']).toBe('key2');
      expect(csvItems[3]['attName=att13']).toBe('key3|xkey31');
      expect(csvItems[3]['attName=att14']).toBe('10|kg');

      // item 2
      expect(csvItems[4].parentName).toBe('');
      expect(csvItems[4].name).toBe('item 2');
      expect(csvItems[4].description).toBe('item 2 description');
      expect(csvItems[4]['attName=att01']).toBe('some string');
      expect(csvItems[4]['attName=att02']).toBe('some text');
      expect(csvItems[4]['attName=att03']).toBe('10.0');
      expect(csvItems[4]['attId=17']).toBe('10-09-2018');
      expect(csvItems[4]['attName=att05']).toBe('23.50');
      expect(csvItems[4]['attName=att06']).toBe('11.11|l');
      expect(csvItems[4]['attName=att07']).toBe('12.01|13.01|14.01|m');
      expect(csvItems[4]['attName=att08']).toBe('11|m2');
      expect(csvItems[4]['attName=att09']).toBe('33|m');
      expect(csvItems[4]['attName=att10']).toBe('44|m');
      expect(csvItems[4]['attName=att11']).toBe('55|m');
      expect(csvItems[4]['attName=att12']).toBe('key2');
      expect(csvItems[4]['attName=att13']).toBe('key3|xkey31');
      expect(csvItems[4]['attName=att14']).toBe('10|kg');

      // item 3
      expect(csvItems[5].parentName).toBe('');
      expect(csvItems[5].name).toBe('item 3');
      expect(csvItems[5].description).toBe('item 3 description');
      expect(csvItems[5]['attName=att01']).toBe('some string');
      expect(csvItems[5]['attName=att02']).toBe('some text');
      expect(csvItems[5]['attName=att03']).toBe('10.0');
      expect(csvItems[5]['attId=17']).toBe('10-09-2018');
      expect(csvItems[5]['attName=att05']).toBe('23.50');
      expect(csvItems[5]['attName=att06']).toBe('11.11|l');
      expect(csvItems[5]['attName=att07']).toBe('12.01|13.01|14.01|m');
      expect(csvItems[5]['attName=att08']).toBe('11|m2');
      expect(csvItems[5]['attName=att09']).toBe('33|m');
      expect(csvItems[5]['attName=att10']).toBe('44|m');
      expect(csvItems[5]['attName=att11']).toBe('55|m');
      expect(csvItems[5]['attName=att12']).toBe('key2');
      expect(csvItems[5]['attName=att13']).toBe('key3|xkey31');
      expect(csvItems[5]['attName=att14']).toBe('10|kg');
  });


    it(`readCsv (prices)`, async () => {
        const b: Buffer = await util.promisify(readFile)(path.join(__dirname, 'import-csv-service-assets', 'sample-import-prices.csv'));
        const csvPrices: CsvPrice[] = await readCsv<CsvPrice>(b);

        expect(csvPrices).toBeDefined();
        expect(csvPrices.length).toBe(2);

        // price #1
        expect(csvPrices[0].addToPricingStructureIfItemNotAlreadyAdded).toBe('true' as any);
        expect(csvPrices[0].pricingStructureFormat).toBe('id=2');
        expect(csvPrices[0].itemFormat).toBe('id=15');
        expect(csvPrices[0].price).toBe('20.50' as any);
        expect(csvPrices[0].country).toBe('AUD');

        // price #2
        expect(csvPrices[1].addToPricingStructureIfItemNotAlreadyAdded).toBe('true' as any);
        expect(csvPrices[1].pricingStructureFormat).toBe('name=Pricing Structure #2');
        expect(csvPrices[1].itemFormat).toBe('name=item 3');
        expect(csvPrices[1].price).toBe('10.10' as any);
        expect(csvPrices[1].country).toBe('AUD');
    });
});