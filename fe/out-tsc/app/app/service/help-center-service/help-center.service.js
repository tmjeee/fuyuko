import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
const CATEGORIES = [
    { id: 1, name: 'Generic Help', description: 'FAQs about generic help' },
    { id: 2, name: 'Import Data', description: 'FAQs about Importing data' },
    { id: 3, name: 'Export Data', description: 'FAQs about Exporting Data' },
    { id: 4, name: 'Bulk Edit', description: 'FAQs about Bulk Edit' },
    { id: 5, name: 'Items and Attributes', description: 'FAQs about Items and Attributes' },
    { id: 6, name: 'Users and Roles', description: 'FAQs about Users and Roles' },
    { id: 7, name: 'Scheduled Jobs', description: 'FAQs about Jobs and their scheduling' },
    { id: 8, name: 'Forums', description: 'FAQs about Forum and usage' },
    { id: 9, name: 'Dashboard and Widgets', description: 'FAQs about Dashboard and Widgets' },
    { id: 10, name: 'Views', description: 'FAQs about Views' },
    { id: 11, name: 'Pricing Structure', description: 'FAQs about Pricing Structure and Business Partners' },
    { id: 12, name: 'Settings', description: 'FAQs about generic Settings' },
];
const FAQS = [
    { id: 1, categoryId: 1, title: 'What about this {replace}', description: '{replace} asd asdjkj asdjkjas djkka sdjkjaasl djks jskjasd jkjsd asd',
        answer: 'sd jasjd jkjas djkk asjdjjkkasd jjksalls jdsjjsa  jdjkjs asdj jjjsdk jjaskdkjjs jjdskkasdjj sdjkkasd dsd' },
    { id: 2, categoryId: 2, title: 'Guess what is going on', description: 'this is what is going on ',
        answer: 'asd this is the answer of what is ging on testing 123' },
];
let HelpCenterService = class HelpCenterService {
    getFaqsCategories() {
        return of([...CATEGORIES]);
    }
    getFaqs(categoryId) {
        const faqs = FAQS.map((f) => {
            const r = Math.random();
            const ff = Object.assign(f, { categoryId });
            ff.title = ff.title.replace('\{replace\}', '' + r);
            ff.description = ff.description.replace('\{replace\}', '' + r);
            ff.answer += (' ' + Math.random());
            return ff;
        });
        return of(faqs);
    }
};
HelpCenterService = tslib_1.__decorate([
    Injectable()
], HelpCenterService);
export { HelpCenterService };
//# sourceMappingURL=help-center.service.js.map