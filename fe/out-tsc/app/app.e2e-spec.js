"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var app_po_1 = require("./app.po");
var protractor_1 = require("protractor");
describe('workspace-project App', function () {
    var page;
    beforeEach(function () {
        page = new app_po_1.AppPage();
    });
    it('should display welcome message', function () {
        page.navigateTo();
        expect(page.getTitleText()).toEqual('Welcome to mat-test!');
    });
    afterEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var logs;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.manage().logs().get(protractor_1.logging.Type.BROWSER)];
                case 1:
                    logs = _a.sent();
                    expect(logs).not.toContain(jasmine.objectContaining({
                        level: protractor_1.logging.Level.SEVERE,
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=app.e2e-spec.js.map