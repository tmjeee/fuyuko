import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { tap } from 'rxjs/operators';
let HelpCenterComponent = class HelpCenterComponent {
    constructor() { }
    ngOnInit() {
        this.loadingFaqs = false;
        this.faqs = [];
    }
    onFaqCategoryClicked($event, category) {
        this.loadingFaqs = true;
        this.faqsFn(category.id).pipe(tap((f) => {
            this.faqs = f;
            this.loadingFaqs = false;
        })).subscribe();
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], HelpCenterComponent.prototype, "categories", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function)
], HelpCenterComponent.prototype, "faqsFn", void 0);
HelpCenterComponent = tslib_1.__decorate([
    Component({
        selector: 'app-help-center',
        templateUrl: './help-center.component.html',
        styleUrls: ['./help-center.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [])
], HelpCenterComponent);
export { HelpCenterComponent };
//# sourceMappingURL=help-center.component.js.map