import {Injectable} from '@angular/core';

@Injectable()
export class CounterService {

  negativeCounter: number;
  positiveCounter: number;

  constructor() {
    this.negativeCounter = -1;
    this.positiveCounter = 1;
  }

  nextNegativeNumber(): number {
    return this.negativeCounter--;
  }

  nextPositiveNumber(): number {
    return this.positiveCounter++;
  }

}
