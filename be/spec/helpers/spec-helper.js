"use strict";
beforeEach(function () {
    jasmine.addMatchers({
        // sample matchers
        toAlwaysBeTrue: function () {
            return {
                compare: function (actual, expected) {
                    return {
                        pass: true
                    };
                }
            };
        }
    });
});
