import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
let CounterService = class CounterService {
    constructor() {
        this.negativeCounter = -1;
    }
    nextNegativeNumber() {
        return this.negativeCounter--;
    }
};
CounterService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [])
], CounterService);
export { CounterService };
//# sourceMappingURL=counter.service.js.map