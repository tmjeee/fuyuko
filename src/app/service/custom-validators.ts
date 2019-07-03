import {AbstractControl, ValidationErrors} from '@angular/forms';
import * as moment from 'moment';


export const intValidator = (c: AbstractControl): ValidationErrors => {
  if (c.value) {
    const r: number = parseInt(c.value, 10);
    if (Number.isNaN(r)) {
      return {int: true};
    }
  }
  return null;
};

export const numberFormatValidator = (c: AbstractControl): ValidationErrors => {
  if (c.value) {
    const cVal = c.value.toString();
    if (cVal.indexOf('0') < 0 && cVal.indexOf('#') < 0) {
      return { numberFormat: true };
    }
  }
  return null;
};

export const dateFormatValidator = (c: AbstractControl): ValidationErrors => {
  if (c.value) {
    const cVal = c.value.toString();
    if (!moment(new Date(), cVal).isValid()) {
      return { dateFormat: true };
    }
  }
  return null;
};

export const timeFormatValidator = (c: AbstractControl): ValidationErrors => {
  return dateFormatValidator(c);
};

export const datetimeFormatValidator = (c: AbstractControl): ValidationErrors => {
  return dateFormatValidator(c);
};
