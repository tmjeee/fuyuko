
const jasmineSpecReporter = require('jasmine-spec-reporter').SpecReporter;
const jasmineTsConsoleReporter = require(`jasmine-ts-console-reporter`);

const SpecReporter = jasmineSpecReporter.SpecReporter;

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new jasmineSpecReporter({
    spec: {
        displayPending: true
    }
}));
jasmine.getEnv().addReporter(new jasmineTsConsoleReporter());

