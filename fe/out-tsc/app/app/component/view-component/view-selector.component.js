import * as tslib_1 from "tslib";
import { Component, EventEmitter, Output } from '@angular/core';
import { ViewService } from '../../service/view-service/view.service';
import { map } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
let ViewSelectorComponent = class ViewSelectorComponent {
    constructor(viewService, formBuilder) {
        this.viewService = viewService;
        this.formBuilder = formBuilder;
        this.formControlView = this.formBuilder.control(null);
        this.events = new EventEmitter();
    }
    ngOnInit() {
        this.viewService
            .getAllViews()
            .pipe(map((v) => {
            this.allViews = v;
            this.ready = true;
        }), map(() => {
            this.subscription = this.viewService
                .asObserver()
                .pipe(map((v) => {
                if (v) {
                    this.currentView = this.allViews ? this.allViews.find((vv) => vv.id === v.id) : undefined;
                    this.formControlView.setValue(v);
                    this.events.emit(v);
                }
                else { // no current view yet
                    if (!this.currentView && this.allViews.length) {
                        this.viewService.setCurrentView(this.allViews[0]);
                    }
                }
            })).subscribe();
        })).subscribe();
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
};
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], ViewSelectorComponent.prototype, "events", void 0);
ViewSelectorComponent = tslib_1.__decorate([
    Component({
        selector: 'app-view-selector',
        templateUrl: './view-selector.component.html',
        styleUrls: ['./view-selector.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [ViewService,
        FormBuilder])
], ViewSelectorComponent);
export { ViewSelectorComponent };
//# sourceMappingURL=view-selector.component.js.map