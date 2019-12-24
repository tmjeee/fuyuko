import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { HelpCenterService } from '../../service/help-center-service/help-center.service';
import { tap } from 'rxjs/operators';
let HelpCenterPageComponent = class HelpCenterPageComponent {
    constructor(helpCenterFaqs) {
        this.helpCenterFaqs = helpCenterFaqs;
    }
    ngOnInit() {
        this.categories = [];
        this.helpCenterFaqs.getFaqsCategories().pipe(tap((c) => this.categories = c)).subscribe();
        this.faqsFn = (categoryId) => {
            return this.helpCenterFaqs.getFaqs(categoryId);
        };
    }
};
HelpCenterPageComponent = tslib_1.__decorate([
    Component({
        templateUrl: './help-center.page.html',
        styleUrls: ['./help-center.page.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [HelpCenterService])
], HelpCenterPageComponent);
export { HelpCenterPageComponent };
//# sourceMappingURL=help-center.page.js.map