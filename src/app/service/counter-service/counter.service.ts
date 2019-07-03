import {Injectable} from '@angular/core';

@Injectable()
export class CounterService {

  negativeCounter: number;

  constructor() {
    this.negativeCounter = -1;
  }

  nextNegativeNumber(): number {
    return this.negativeCounter--;
  }

}
