import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AttributeService } from '../../service/attribute-service/attribute.service';
import { ViewService } from '../../service/view-service/view.service';
import { map } from 'rxjs/operators';
let BulkEditPageComponent = class BulkEditPageComponent {
    constructor(viewService, attributeService) {
        this.viewService = viewService;
        this.attributeService = attributeService;
    }
    ngOnInit() {
        this.viewService.getAllViews()
            .pipe(map((v) => {
            this.allViews = v;
        }), map(() => {
            this.subscription = this.viewService.asObserver()
                .pipe(map((v) => {
                if (v) {
                    this.currentView = this.allViews ? this.allViews.find((vv) => vv.id === v.id) : undefined;
                    this.subscription = this.attributeService.getAllAttributesByView(this.currentView.id)
                        .pipe(map((a) => {
                        this.attributes = a;
                    })).subscribe();
                }
            })).subscribe();
        })).subscribe();
    }
    onViewSelectionChanged($event) {
        const view = $event.value;
        this.viewService.setCurrentView(view);
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
};
BulkEditPageComponent = tslib_1.__decorate([
    Component({
        templateUrl: './bulk-edit.page.html',
        styleUrls: ['./bulk-edit.page.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [ViewService, AttributeService])
], BulkEditPageComponent);
export { BulkEditPageComponent };
//# sourceMappingURL=bulk-edit.page.js.map