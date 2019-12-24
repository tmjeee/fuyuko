import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RuleEditorDialogComponent } from './rule-editor-dialog.component';
import { map } from 'rxjs/operators';
let RulesTableComponent = class RulesTableComponent {
    constructor(matDialog) {
        this.matDialog = matDialog;
        this.rules = [];
        this.attributes = [];
        this.counter = -1;
        this.events = new EventEmitter();
    }
    onDeleteRule($event, rule) {
        $event.stopImmediatePropagation();
        $event.preventDefault();
        this.events.emit({
            type: 'delete',
            rule: Object.assign({}, rule),
        });
    }
    onEditRule($event, rule) {
        $event.stopImmediatePropagation();
        $event.preventDefault();
        const matDialogRef = this.matDialog.open(RuleEditorDialogComponent, {
            minWidth: '60vw',
            minHeight: '30vh',
            data: {
                attributes: [...this.attributes],
                rule: Object.assign({}, rule),
            }
        });
        matDialogRef.afterClosed()
            .pipe(map((r) => {
            if (r) {
                this.events.emit({
                    type: 'edit',
                    rule: Object.assign({}, r)
                });
            }
        })).subscribe();
    }
    onAddRule($event) {
        const matDialogRef = this.matDialog.open(RuleEditorDialogComponent, {
            minWidth: '60vw',
            minHeight: '30vh',
            data: {
                attributes: this.attributes,
                rule: {
                    id: this.counter--,
                    name: '',
                    description: '',
                    validateClauses: [],
                    whenClauses: []
                }
            }
        });
        matDialogRef.afterClosed()
            .pipe(map((r) => {
            if (r) {
                this.events.emit({
                    type: 'add',
                    rule: Object.assign({}, r)
                });
            }
        })).subscribe();
    }
    findAttribute(attributeId) {
        return this.attributes.find((a) => a.id === attributeId);
    }
    onEnableRule($event, rule) {
        $event.stopImmediatePropagation();
        $event.preventDefault();
        this.events.emit({
            type: 'enable',
            rule
        });
    }
    onDisableRule($event, rule) {
        $event.stopImmediatePropagation();
        $event.preventDefault();
        this.events.emit({
            type: 'disable',
            rule
        });
    }
    isEnabled(rule) {
        return rule.status === 'ENABLED';
    }
    isDisabled(rule) {
        return rule.status === 'DISABLED';
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], RulesTableComponent.prototype, "attributes", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], RulesTableComponent.prototype, "rules", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], RulesTableComponent.prototype, "events", void 0);
RulesTableComponent = tslib_1.__decorate([
    Component({
        selector: 'app-rules-table',
        templateUrl: './rules-table.component.html',
        styleUrls: ['./rules-table.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [MatDialog])
], RulesTableComponent);
export { RulesTableComponent };
//# sourceMappingURL=rules-table.component.js.map