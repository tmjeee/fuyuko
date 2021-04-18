import {currencyValidator, intValidator, numberValidator} from './custom-validators';
import {AbstractControl} from '@angular/forms';

describe('custom-validators', () => {
  it(`currencyValidator should validate property`, () => {
    expect(currencyValidator({value: null} as AbstractControl)).toBeFalsy(); // validate ok
    expect(currencyValidator({value: 9.01} as AbstractControl)).toBeFalsy();
    expect(currencyValidator({value: 9.0} as AbstractControl)).toBeDefined(); // not ok
    expect(currencyValidator({value: 9.} as AbstractControl)).toBeDefined();
    expect(currencyValidator({value: 9} as AbstractControl)).toBeDefined();
    expect(currencyValidator({value: 'asd'} as AbstractControl)).toBeDefined();
    expect(currencyValidator({value: '9'} as AbstractControl)).toBeDefined();
    expect(currencyValidator({value: '9.0'} as AbstractControl)).toBeDefined();
    expect(currencyValidator({value: '9.01'} as AbstractControl)).toBeFalsy();
  });

  it('numberValidator should validate properly', () => {
    expect(numberValidator({value: null} as AbstractControl)).toBeFalsy();
    expect(numberValidator({value: '10'} as AbstractControl)).toBeFalsy();
    expect(numberValidator({value: 10} as AbstractControl)).toBeFalsy();
    expect(numberValidator({value: '10.1'} as AbstractControl)).toBeFalsy();
    expect(numberValidator({value: 10.1} as AbstractControl)).toBeFalsy();
    expect(numberValidator({value: 'asdsd'} as AbstractControl)).toBeDefined();
    expect(numberValidator({value: 'x1xx1'} as AbstractControl)).toBeDefined();
  });

  it('intValidator should validate property', () => {
    expect(intValidator({value: null} as AbstractControl)).toBeFalsy();
    expect(intValidator({value: '10'} as AbstractControl)).toBeFalsy();
    expect(intValidator({value: 10} as AbstractControl)).toBeFalsy();
    expect(intValidator({value: 'asd'} as AbstractControl)).toBeDefined();
    expect(intValidator({value: 10.1} as AbstractControl)).toBeDefined();
    expect(intValidator({value: '10.1'} as AbstractControl)).toBeDefined();
    expect(intValidator({value: 10.0} as AbstractControl)).toBeFalsy();
    expect(intValidator({value: '10.0'} as AbstractControl)).toBeFalsy();
  });

});
