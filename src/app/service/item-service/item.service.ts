import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {
  AreaValue,
  CurrencyValue,
  DateValue, DimensionValue, DoubleSelectValue, HeightValue,
  TableItem,
  ItemValTypes, LengthValue,
  NumberValue, SelectValue,
  StringValue,
  TextValue,
  Value, VolumeValue, WidthValue, Item
} from '../../model/item.model';
import {Attribute} from '../../model/attribute.model';
import {TableItemAndAttribute} from '../../model/item-attribute.model';
import {SearchType} from '../../component/item-search-component/item-search.component';
import {copyAttrProperties} from '../../utils/item-to-table-items.util';


const ALL_ITEMS: Item[] = [
  {
    id: 1,
    name: 'item 1',
    description: 'item description 1',
    images: [],
    parentId: undefined,
    1:  { attributeId: 1,  val: {type: 'string',          value: 'some string'} as StringValue} as Value,
    2:  { attributeId: 2,  val: {type: 'text',            value: 'some text'} as TextValue} as Value,
    3:  { attributeId: 3,  val: {type: 'number',          value: 1} as NumberValue} as Value,
    4:  { attributeId: 4,  val: {type: 'date',            value: '01-01-2007', format: 'DD-MM-YYYY'} as DateValue} as Value,
    5:  { attributeId: 7,  val: {type: 'currency',        value: 20.10, country: 'AUD' } as CurrencyValue} as Value,
    6:  { attributeId: 8,  val: {type: 'volume',          value: 30.10, unit: 'l'} as VolumeValue} as Value,
    // tslint:disable-next-line:max-line-length
    7:  { attributeId: 9,  val: {type: 'dimension',       length: 10.10, width: 10.11, height: 10.12, unit: 'm'} as DimensionValue} as Value,
    8:  { attributeId: 10, val: {type: 'area',            value: 20.20, unit: 'm2'} as AreaValue} as Value,
    9:  { attributeId: 11, val: {type: 'length',          value: 10.1, unit: 'm'} as LengthValue} as Value,
    10: { attributeId: 12, val: {type: 'width',           value: 10.2, unit: 'm'} as WidthValue} as Value,
    11: { attributeId: 13, val: {type: 'height',          value: 10.3, unit: 'm'} as HeightValue} as Value,
    12: { attributeId: 14, val: {type: 'select',          key: 'key2' } as SelectValue} as Value,
    13: { attributeId: 15, val: {type: 'doubleselect',    key1: 'akey3', key2: 'bkey5'} as DoubleSelectValue } as Value,
    children: [
      {
        id: 100,
        images: [],
        name: 'item a',
        description: 'item a description',
        parentId: 1,
        1:  { attributeId: 1,  val: {type: 'string',          value: 'xxx some string'} as StringValue} as Value,
        2:  { attributeId: 2,  val: {type: 'text',            value: 'xxx some text'} as TextValue} as Value,
        3:  { attributeId: 3,  val: {type: 'number',          value: 100} as NumberValue} as Value,
        4:  { attributeId: 4,  val: {type: 'date',            value: '02-02-2017', format: 'DD-MM-YYYY'} as DateValue} as Value,
        5:  { attributeId: 7,  val: {type: 'currency',        value: 22.22, country: 'AUD' } as CurrencyValue} as Value,
        6:  { attributeId: 8,  val: {type: 'volume',          value: 32.22, unit: 'l'} as VolumeValue} as Value,
        // tslint:disable-next-line:max-line-length
        7:  { attributeId: 9,  val: {type: 'dimension',       length: 22.10, width: 10.11, height: 10.12, unit: 'm'} as DimensionValue} as Value,
        8:  { attributeId: 10, val: {type: 'area',            value: 22.20, unit: 'm2'} as AreaValue} as Value,
        9:  { attributeId: 11, val: {type: 'length',          value: 22.1, unit: 'm'} as LengthValue} as Value,
        10: { attributeId: 12, val: {type: 'width',           value: 22.2, unit: 'm'} as WidthValue} as Value,
        11: { attributeId: 13, val: {type: 'height',          value: 22.3, unit: 'm'} as HeightValue} as Value,
        12: { attributeId: 14, val: {type: 'select',          key: 'key2' } as SelectValue} as Value,
        13: { attributeId: 15, val: {type: 'doubleselect',    key1: 'akey3', key2: 'bkey5'} as DoubleSelectValue } as Value,
        children: [
          {
            id: 1000,
            name: 'item x',
            description: 'item description x',
            images: [],
            parentId: 100,
            1:  { attributeId: 1,  val: {type: 'string',          value: 'yyy some string'} as StringValue} as Value,
            2:  { attributeId: 2,  val: {type: 'text',            value: 'yyy some text'} as TextValue} as Value,
            3:  { attributeId: 3,  val: {type: 'number',          value: 1000} as NumberValue} as Value,
            4:  { attributeId: 4,  val: {type: 'date',            value: '02-02-2017', format: 'DD-MM-YYYY'} as DateValue} as Value,
            5:  { attributeId: 7,  val: {type: 'currency',        value: 22.22, country: 'AUD' } as CurrencyValue} as Value,
            6:  { attributeId: 8,  val: {type: 'volume',          value: 32.22, unit: 'l'} as VolumeValue} as Value,
            // tslint:disable-next-line:max-line-length
            7:  { attributeId: 9,  val: {type: 'dimension',       length: 22.10, width: 10.11, height: 10.12, unit: 'm'} as DimensionValue} as Value,
            8:  { attributeId: 10, val: {type: 'area',            value: 22.20, unit: 'm2'} as AreaValue} as Value,
            9:  { attributeId: 11, val: {type: 'length',          value: 22.1, unit: 'm'} as LengthValue} as Value,
            10: { attributeId: 12, val: {type: 'width',           value: 22.2, unit: 'm'} as WidthValue} as Value,
            11: { attributeId: 13, val: {type: 'height',          value: 22.3, unit: 'm'} as HeightValue} as Value,
            12: { attributeId: 14, val: {type: 'select',          key: 'key2' } as SelectValue} as Value,
            13: { attributeId: 15, val: {type: 'doubleselect',    key1: 'akey3', key2: 'bkey5'} as DoubleSelectValue } as Value,
            children: [
              {
                id: 10000,
                name: 'item xx',
                description: 'item xx description',
                images: [],
                parentId: 1000,
                1:  { attributeId: 1,  val: {type: 'string',          value: 'zzz some string'} as StringValue} as Value,
                2:  { attributeId: 2,  val: {type: 'text',            value: 'zzz some text'} as TextValue} as Value,
                3:  { attributeId: 3,  val: {type: 'number',          value: 10000} as NumberValue} as Value,
                4:  { attributeId: 4,  val: {type: 'date',            value: '02-02-2017', format: 'DD-MM-YYYY'} as DateValue} as Value,
                5:  { attributeId: 7,  val: {type: 'currency',        value: 22.22, country: 'AUD' } as CurrencyValue} as Value,
                6:  { attributeId: 8,  val: {type: 'volume',          value: 32.22, unit: 'l'} as VolumeValue} as Value,
                // tslint:disable-next-line:max-line-length
                7:  { attributeId: 9,  val: {type: 'dimension',       length: 22.10, width: 10.11, height: 10.12, unit: 'm'} as DimensionValue} as Value,
                8:  { attributeId: 10, val: {type: 'area',            value: 22.20, unit: 'm2'} as AreaValue} as Value,
                9:  { attributeId: 11, val: {type: 'length',          value: 22.1, unit: 'm'} as LengthValue} as Value,
                10: { attributeId: 12, val: {type: 'width',           value: 22.2, unit: 'm'} as WidthValue} as Value,
                11: { attributeId: 13, val: {type: 'height',          value: 22.3, unit: 'm'} as HeightValue} as Value,
                12: { attributeId: 14, val: {type: 'select',          key: 'key2' } as SelectValue} as Value,
                13: { attributeId: 15, val: {type: 'doubleselect',    key1: 'akey3', key2: 'bkey5'} as DoubleSelectValue } as Value,
                children: [ ]
              } as Item,
            ]
          } as Item,
        ]
      } as Item,
    ]
  } as Item,
  {
    id: 2,
    name: 'item 02',
    description: 'item description 02',
    images: [],
    parentId: undefined,
    1:  { attributeId: 1,  val: {type: 'string',          value: 'some string #2'} as StringValue} as Value,
    2:  { attributeId: 2,  val: {type: 'text',            value: 'some text #2'} as TextValue} as Value,
    3:  { attributeId: 3,  val: {type: 'number',          value: 1} as NumberValue} as Value,
    4:  { attributeId: 4,  val: {type: 'date',            value: '01-01-2007', format: 'DD-MM-YYYY'} as DateValue} as Value,
    5:  { attributeId: 7,  val: {type: 'currency',        value: 20.10, country: 'AUD' } as CurrencyValue} as Value,
    6:  { attributeId: 8,  val: {type: 'volume',          value: 30.10, unit: 'l'} as VolumeValue} as Value,
    // tslint:disable-next-line:max-line-length
    7:  { attributeId: 9,  val: {type: 'dimension',       length: 10.10, width: 10.11, height: 10.12, unit: 'm'} as DimensionValue} as Value,
    8: { attributeId: 10, val: {type: 'area',            value: 20.20, unit: 'm2'} as AreaValue} as Value,
    9: { attributeId: 11, val: {type: 'length',          value: 10.1, unit: 'm'} as LengthValue} as Value,
    10: { attributeId: 12, val: {type: 'width',           value: 10.2, unit: 'm'} as WidthValue} as Value,
    11: { attributeId: 13, val: {type: 'height',          value: 10.3, unit: 'm'} as HeightValue} as Value,
    12: { attributeId: 14, val: {type: 'select',          key: 'key2' } as SelectValue} as Value,
    13: { attributeId: 15, val: {type: 'doubleselect',    key1: 'akey3', key2: 'bkey5'} as DoubleSelectValue } as Value,
    children: []
  } as Item,
  {
    id: 3,
    name: 'item 03',
    description: 'item description 03',
    images: [],
    parentId: undefined,
    1:  { attributeId: 1,  val: {type: 'string',          value: 'some string #3'} as StringValue} as Value,
    2:  { attributeId: 2,  val: {type: 'text',            value: 'some text #3'} as TextValue} as Value,
    3:  { attributeId: 3,  val: {type: 'number',          value: 1} as NumberValue} as Value,
    4:  { attributeId: 4,  val: {type: 'date',            value: '01-01-2007', format: 'DD-MM-YYYY'} as DateValue} as Value,
    5:  { attributeId: 7,  val: {type: 'currency',        value: 20.10, country: 'AUD' } as CurrencyValue} as Value,
    6:  { attributeId: 8,  val: {type: 'volume',          value: 30.10, unit: 'l'} as VolumeValue} as Value,
    // tslint:disable-next-line:max-line-length
    7:  { attributeId: 9,  val: {type: 'dimension',       length: 10.10, width: 10.11, height: 10.12, unit: 'm'} as DimensionValue} as Value,
    8:  { attributeId: 10, val: {type: 'area',            value: 20.20, unit: 'm2'} as AreaValue} as Value,
    9:  { attributeId: 11, val: {type: 'length',          value: 10.1, unit: 'm'} as LengthValue} as Value,
    10: { attributeId: 12, val: {type: 'width',           value: 10.2, unit: 'm'} as WidthValue} as Value,
    11: { attributeId: 13, val: {type: 'height',          value: 10.3, unit: 'm'} as HeightValue} as Value,
    12: { attributeId: 14, val: {type: 'select',          key: 'key2' } as SelectValue} as Value,
    13: { attributeId: 15, val: {type: 'doubleselect',    key1: 'akey3', key2: 'bkey5'} as DoubleSelectValue } as Value,
    children: []
  } as Item,
  {
    id: 4,
    name: 'item04',
    description: 'item description 04',
    images: [],
    parentId: undefined,
    1:  { attributeId: 1,  val: {type: 'string',          value: 'some string #4'} as StringValue} as Value,
    2:  { attributeId: 2,  val: {type: 'text',            value: 'some text #4'} as TextValue} as Value,
    3:  { attributeId: 3,  val: {type: 'number',          value: 1} as NumberValue} as Value,
    4:  { attributeId: 4,  val: {type: 'date',            value: '01-01-2007', format: 'DD-MM-YYYY'} as DateValue} as Value,
    5:  { attributeId: 7,  val: {type: 'currency',        value: 20.10, country: 'AUD' } as CurrencyValue} as Value,
    6:  { attributeId: 8,  val: {type: 'volume',          value: 30.10, unit: 'l'} as VolumeValue} as Value,
    // tslint:disable-next-line:max-line-length
    7:  { attributeId: 9,  val: {type: 'dimension',       length: 10.10, width: 10.11, height: 10.12, unit: 'm'} as DimensionValue} as Value,
    8:  { attributeId: 10, val: {type: 'area',            value: 20.20, unit: 'm2'} as AreaValue} as Value,
    9:  { attributeId: 11, val: {type: 'length',          value: 10.1, unit: 'm'} as LengthValue} as Value,
    10: { attributeId: 12, val: {type: 'width',           value: 10.2, unit: 'm'} as WidthValue} as Value,
    11: { attributeId: 13, val: {type: 'height',          value: 10.3, unit: 'm'} as HeightValue} as Value,
    12: { attributeId: 14, val: {type: 'select',          key: 'key2' } as SelectValue} as Value,
    13: { attributeId: 15, val: {type: 'doubleselect',    key1: 'akey3', key2: 'bkey5'} as DoubleSelectValue } as Value,
    children: []
  } as Item,
  {
    id: 5,
    name: 'item 05',
    description: 'item description 05',
    images: [],
    parentId: undefined,
    1:  { attributeId: 1,  val: {type: 'string',          value: 'some string #5'} as StringValue} as Value,
    2:  { attributeId: 2,  val: {type: 'text',            value: 'some text #5'} as TextValue} as Value,
    3:  { attributeId: 3,  val: {type: 'number',          value: 1} as NumberValue} as Value,
    4:  { attributeId: 4,  val: {type: 'date',            value: '01-01-2007', format: 'DD-MM-YYYY'} as DateValue} as Value,
    5:  { attributeId: 7,  val: {type: 'currency',        value: 20.10, country: 'AUD' } as CurrencyValue} as Value,
    6:  { attributeId: 8,  val: {type: 'volume',          value: 30.10, unit: 'l'} as VolumeValue} as Value,
    // tslint:disable-next-line:max-line-length
    7:  { attributeId: 9,  val: {type: 'dimension',       length: 10.10, width: 10.11, height: 10.12, unit: 'm'} as DimensionValue} as Value,
    8:  { attributeId: 10, val: {type: 'area',            value: 20.20, unit: 'm2'} as AreaValue} as Value,
    9:  { attributeId: 11, val: {type: 'length',          value: 10.1, unit: 'm'} as LengthValue} as Value,
    10: { attributeId: 12, val: {type: 'width',           value: 10.2, unit: 'm'} as WidthValue} as Value,
    11: { attributeId: 13, val: {type: 'height',          value: 10.3, unit: 'm'} as HeightValue} as Value,
    12: { attributeId: 14, val: {type: 'select',          key: 'key2' } as SelectValue} as Value,
    13: { attributeId: 15, val: {type: 'doubleselect',    key1: 'akey3', key2: 'bkey5'} as DoubleSelectValue } as Value,
    children: []
  } as Item,
  {
    id: 6,
    name: 'item 06',
    description: 'item description 06',
    images: [],
    parentId: undefined,
    1:  { attributeId: 1,  val: {type: 'string',          value: 'some string #6'} as StringValue} as Value,
    2:  { attributeId: 2,  val: {type: 'text',            value: 'some text #6'} as TextValue} as Value,
    3:  { attributeId: 3,  val: {type: 'number',          value: 1} as NumberValue} as Value,
    4:  { attributeId: 4,  val: {type: 'date',            value: '01-01-2007', format: 'DD-MM-YYYY'} as DateValue} as Value,
    5:  { attributeId: 7,  val: {type: 'currency',        value: 20.10, country: 'AUD' } as CurrencyValue} as Value,
    6:  { attributeId: 8,  val: {type: 'volume',          value: 30.10, unit: 'l'} as VolumeValue} as Value,
    // tslint:disable-next-line:max-line-length
    7:  { attributeId: 9,  val: {type: 'dimension',       length: 10.10, width: 10.11, height: 10.12, unit: 'm'} as DimensionValue} as Value,
    8:  { attributeId: 10, val: {type: 'area',            value: 20.20, unit: 'm2'} as AreaValue} as Value,
    9:  { attributeId: 11, val: {type: 'length',          value: 10.1, unit: 'm'} as LengthValue} as Value,
    10: { attributeId: 12, val: {type: 'width',           value: 10.2, unit: 'm'} as WidthValue} as Value,
    11: { attributeId: 13, val: {type: 'height',          value: 10.3, unit: 'm'} as HeightValue} as Value,
    12: { attributeId: 14, val: {type: 'select',          key: 'key2' } as SelectValue} as Value,
    13: { attributeId: 15, val: {type: 'doubleselect',    key1: 'akey3', key2: 'bkey5'} as DoubleSelectValue } as Value,
    children: []
  } as Item,
];


const SOME_ITEMS = ALL_ITEMS.slice(0, 2);


@Injectable()
export class ItemService {

  counter = ALL_ITEMS.length;

  getAllItems(viewId: number, search: string = '', searchType: SearchType = 'basic'): Observable<Item[]> {
    if (search) {
      return of ([...SOME_ITEMS]);
    } else {
      return of([...ALL_ITEMS]);
    }
  }

  saveItems(items: Item[]): Observable<Item[]> {
    console.log('service save item', items);
    // todo:
    const newlyAddedItems: Item[] = [];
    items.forEach((i: Item) => {
      if (i.id <  0) { // new item
        const nextId =  this.counter++;
        i.id = nextId;
        const item: Item =  {id: i.id, parentId: i.parentId, children: []} as Item;
        item.name = i.name;
        item.description = i.description;
        copyAttrProperties(i, item);
        ALL_ITEMS.push(item);
        newlyAddedItems.push(item);
      } else { // update existing item
        const item: Item = ALL_ITEMS.find((i2: Item) => i2.id === i.id);
        item.name = i.name;
        item.description = i.description;
        copyAttrProperties(i, item);
        newlyAddedItems.push(item);
      }
    });
    return of([...newlyAddedItems]);
  }

  saveTableItems(items: TableItem[]): Observable<Item[]> {
    // todo:
    console.log('service save table item', items);
    const newlyAddedItems: Item[] = [];
    items.forEach((i: TableItem) => {
      if (i.id <  0) { // new item
        const nextId =  this.counter++;
        i.id = nextId;
        const item: Item =  {id: i.id, parentId: i.parentId, children: []} as Item;
        item.name = i.name;
        item.description = i.description;
        copyAttrProperties(i, item);
        ALL_ITEMS.push(item);
        newlyAddedItems.push(item);
      } else { // update existing item
        const item: Item = ALL_ITEMS.find((i2: Item) => i2.id === i.id);
        item.name = i.name;
        item.description = i.description;
        copyAttrProperties(i, item);
        newlyAddedItems.push(item);
      }
    });
    return of([...newlyAddedItems]);
  }

  deleteItems(items: Item[]): Observable<Item[]> {
    // todo:
    const deletedItems: Item[] = [];
    items.forEach((i: Item) => {
      const index = ALL_ITEMS.findIndex((item: Item) => item.id === i.id);
      if (index !== -1) {
        const deletedItem: Item = ALL_ITEMS.splice(index, 1)[0];
        deletedItems.push(deletedItem);
      }
    });
    return of([...deletedItems]);
  }

  deleteTableItems(items: TableItem[]): Observable<Item[]> {
    // todo:
    const deletedItems: Item[] = [];
    items.forEach((i: TableItem) => {
      const index = ALL_ITEMS.findIndex((item: Item) => item.id === i.id);
      if (index !== -1) {
        const deletedItem: Item = ALL_ITEMS.splice(index, 1)[0];
        deletedItems.push(deletedItem);
      }
    });
    return of([...deletedItems]);
  }
}
