import {AbstractControl, ValidationErrors} from '@angular/forms';
import * as moment from 'moment';

export const currencyValidator = (c: AbstractControl): ValidationErrors | null => {
  if (c.value) {
      const cVal = c.value.toString();
      const r = cVal.match(/[0-9]+\.[0-9]{2}/);
      if (!!!r) {
        return {currency: true};
      }
  }
  return null;
};

export const numberValidator = (c: AbstractControl): ValidationErrors | null => {
  if (c.value) {
    const r: number = Number(c.value);
    if (Number.isNaN(r)) {
      return { number: true};
    }
  }
  return null;
};

export const intValidator = (c: AbstractControl): ValidationErrors | null => {
  if (c.value) {
    const r: number = parseInt(c.value, 10);
    if (Number.isNaN(r) || r !== Number(c.value)) {
      return {int: true};
    }
  }
  return null;
};

export const dateValidator = (c: AbstractControl): ValidationErrors | null => {
  if (c.value) {
    if (!moment(c.value).isValid()) {
      return { date: true };
    }
  }
  return null;
};

export const numberFormatValidator = (c: AbstractControl): ValidationErrors | null => {
  if (c.value) {
    const cVal = c.value.toString();
    if (cVal.indexOf('0') < 0 && cVal.indexOf('#') < 0) {
      return { numberFormat: true };
    }
  }
  return null;
};

export const dateFormatValidator = (c: AbstractControl): ValidationErrors | null => {
  if (c.value) {
    const cVal = c.value.toString();
    if (!moment(new Date(), cVal).isValid()) {
      return { dateFormat: true };
    }
  }
  return null;
};

export const timeFormatValidator = (c: AbstractControl): ValidationErrors | null => {
  return dateFormatValidator(c);
};

export const datetimeFormatValidator = (c: AbstractControl): ValidationErrors | null => {
  return dateFormatValidator(c);
};
