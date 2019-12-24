import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
let JobsListingsComponent = class JobsListingsComponent {
    constructor() {
        this.fetchJobs = {};
    }
    onExpansionPanelClosed(job) {
        this.fetchJobs[job.id] = false;
    }
    onExpansionPanelOpened(job) {
        this.fetchJobs[job.id] = true;
    }
    fetch(job) {
        return this.fetchJobs[job.id];
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], JobsListingsComponent.prototype, "jobs", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function)
], JobsListingsComponent.prototype, "fetchFn", void 0);
JobsListingsComponent = tslib_1.__decorate([
    Component({
        selector: 'app-jobs-listings',
        templateUrl: './jobs-listings.component.html',
        styleUrls: ['./jobs-listings.component.scss']
    })
], JobsListingsComponent);
export { JobsListingsComponent };
//# sourceMappingURL=jobs-listings.component.js.map