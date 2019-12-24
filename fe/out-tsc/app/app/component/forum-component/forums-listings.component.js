import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as moment from 'moment';
;
let ForumsListingsComponent = class ForumsListingsComponent {
    constructor() {
        this.events = new EventEmitter();
    }
    formatDate(d) {
        return moment(d).format('DD/MM/YYYY hh:mm:ss a');
    }
    onViewFormDetails($event, forum) {
        $event.preventDefault();
        $event.stopImmediatePropagation();
        this.events.emit({
            forumId: forum.id
        });
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], ForumsListingsComponent.prototype, "forums", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], ForumsListingsComponent.prototype, "events", void 0);
ForumsListingsComponent = tslib_1.__decorate([
    Component({
        selector: 'app-forums-listings',
        templateUrl: './forums-listings.component.html',
        styleUrls: ['./forums-listings.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [])
], ForumsListingsComponent);
export { ForumsListingsComponent };
//# sourceMappingURL=forums-listings.component.js.map