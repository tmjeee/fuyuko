import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
let SettingsComponent = class SettingsComponent {
    constructor(formBuilder) {
        this.formBuilder = formBuilder;
        this.events = new EventEmitter();
        // general tab
        this.formControlDefaultOpenHelpNav = formBuilder.control('', [Validators.required]);
        this.formControlDefaultOpenSideNav = formBuilder.control('', [Validators.required]);
        this.formControlDefaultOpenSubSideNav = formBuilder.control('', [Validators.required]);
        this.formGroupGeneralTab = formBuilder.group({
            defaultOpenHelpNav: this.formControlDefaultOpenHelpNav,
            defaultOpenSideNav: this.formControlDefaultOpenSideNav,
            defaultOpenSubSideNav: this.formControlDefaultOpenSubSideNav
        });
    }
    ngOnInit() {
        this.populate(this.settings);
    }
    ngOnChanges(changes) {
        if (changes.settings) {
            const change = changes.settings;
            const s = change.currentValue;
            this.populate(s);
        }
    }
    populate(s) {
        console.log('****** settings', s);
        this.formControlDefaultOpenHelpNav.setValue(s.defaultOpenHelpNav);
        this.formControlDefaultOpenSideNav.setValue(s.defaultOpenSideNav);
        this.formControlDefaultOpenSubSideNav.setValue(s.defaultOpenSubSideNav);
    }
    onGeneralTabSubmit() {
        const s = Object.assign({}, this.settings);
        s.defaultOpenHelpNav = this.formControlDefaultOpenHelpNav.value;
        s.defaultOpenSideNav = this.formControlDefaultOpenSideNav.value;
        s.defaultOpenSubSideNav = this.formControlDefaultOpenSubSideNav.value;
        this.events.emit({
            settings: s
        });
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], SettingsComponent.prototype, "settings", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], SettingsComponent.prototype, "user", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], SettingsComponent.prototype, "events", void 0);
SettingsComponent = tslib_1.__decorate([
    Component({
        selector: 'app-settings',
        templateUrl: './settings.component.html',
        styleUrls: ['./settings.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [FormBuilder])
], SettingsComponent);
export { SettingsComponent };
//# sourceMappingURL=settings.component.js.map