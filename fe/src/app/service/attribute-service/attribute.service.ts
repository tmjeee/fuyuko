import {Injectable} from '@angular/core';
import {View} from '../../model/view.model';
import {Observable, of} from 'rxjs';
import {Attribute} from '../../model/attribute.model';


@Injectable()
export class AttributeService {

  A: Attribute[] = [
    {id: 1,  type: 'string',    name: 'string attribute',     description: 'This is a string attribute'} as Attribute,
    {id: 2,  type: 'text',      name: 'text attribute',       description: 'This is a text attribute'} as Attribute,
    {id: 3,  type: 'number',    name: 'number attribute',     description: 'This is a number attribute', format: '0.0'} as Attribute,
    {id: 4,  type: 'date',      name: 'date attribute',       description: 'This is a date attribute', format: 'DD-MM-YYYY'} as Attribute,
    {id: 5,  type: 'currency',  name: 'currency attribute',   description: 'This is a currency attribute',
      showCurrencyCountry: true} as Attribute,
    {id: 6,  type: 'volume',    name: 'volume attribute',     description: 'This is a volume attribute', format: '0.0'} as Attribute,
    {id: 7,  type: 'dimension', name: 'dimension attribute',  description: 'This is a dimension attribute', format: '0.0'} as Attribute,
    {id: 8, type: 'area',      name: 'area attribute',       description: 'This is a area attribute', format: '0.0'} as Attribute,
    {id: 9, type: 'length',    name: 'length attribute',     description: 'This is a length attribute', format: '0.0'} as Attribute,
    {id: 10, type: 'width',     name: 'width attribute',      description: 'This is a width attribute', format: '0.0'} as Attribute,
    {id: 11, type: 'height',    name: 'height attribute',     description: 'This is a height attribute', format: '0.0'} as Attribute,
    {id: 12, type: 'select',    name: 'select attribute',     description: 'This is a select attribute',
      pair1: [
        {id: 1, key: 'key1', value: 'value1'},
        {id: 2, key: 'key2', value: 'value2'},
        {id: 3, key: 'key3', value: 'value3'},
        {id: 4, key: 'key4', value: 'value4'},
        {id: 5, key: 'key5', value: 'value5'},
        {id: 6, key: 'key6', value: 'value6'},
        {id: 7, key: 'key7', value: 'value7'},
        {id: 8, key: 'key8', value: 'value8'},
        {id: 9, key: 'key9', value: 'value9'},
      ]},
    {id: 13, type: 'doubleselect', name: 'doubleselect attribute', description: 'This is a doubleselect attribute',
      pair1: [
        {id: 1, key: 'akey1', value: 'avalue1'},
        {id: 2, key: 'akey2', value: 'avalue2'},
        {id: 3, key: 'akey3', value: 'avalue3'},
      ],
      pair2: [
        {id: 1, key1: 'akey1', key2: 'bkey1', value: 'bvalue1'},
        {id: 2, key1: 'akey2', key2: 'bkey2', value: 'bvalue2'},
        {id: 3, key1: 'akey3', key2: 'bkey3', value: 'bvalue3'},
        {id: 3, key1: 'akey3', key2: 'bkey4', value: 'bvalue4'},
        {id: 3, key1: 'akey3', key2: 'bkey5', value: 'bvalue5'},
        {id: 3, key1: 'akey3', key2: 'bkey6', value: 'bvalue6'},
        {id: 3, key1: 'akey3', key2: 'bkey7', value: 'bvalue7'},
      ]
    }
  ];

  readonly B: Attribute[] = [
    {id: 8,  type: 'volume',    name: 'volume attribute',     description: 'This is a volume attribute', format: '0.0'} as Attribute,
    {id: 9,  type: 'dimension', name: 'dimension attribute',  description: 'This is a dimension attribute', format: '0.0'} as Attribute,
    {id: 10, type: 'area',      name: 'area attribute',       description: 'This is a area attribute', format: '0.0'} as Attribute,
    {id: 11, type: 'length',    name: 'length attribute',     description: 'This is a length attribute', format: '0.0'} as Attribute,
    {id: 12, type: 'width',     name: 'width attribute',      description: 'This is a width attribute', format: '0.0'} as Attribute,
    {id: 13, type: 'height',    name: 'height attribute',     description: 'This is a height attribute', format: '0.0'} as Attribute,
  ];


  getAllAttributesByView(viewId: number): Observable<Attribute[]> {
    // todo:
    return of([...this.A]);
  }

  deleteAttribute(view: View, attribute: Attribute): Observable<Attribute> {
    // todo:
    this.A = this.A.filter((a: Attribute) => a.id !== attribute.id);
    return of(attribute);
  }

  searchAttribute(view: View, search: string): Observable<Attribute[]> {
    // todo:
    if (search) {
      return of([...this.B]);
    }
    return this.getAllAttributesByView(view.id);
  }

  addAttribute(view: View, attribute: Attribute): Observable<Attribute> {
    // todo:
    attribute.id = this.A.length;
    this.A.unshift(attribute);
    this.A = [...this.A];
    return of({...attribute});
  }

  updateAttribute(view: View, attribute: Attribute): Observable<Attribute> {
    // todo:
    this.A = this.A.map((a: Attribute) => {
      if (a.id === attribute.id) {
        return attribute;
      }
      return a;
    });
    return of({...attribute});
  }
}

