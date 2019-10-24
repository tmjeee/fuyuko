import {Injectable} from '@angular/core';
import {Faq, FaqCategory} from '../../model/help-center.model';
import {Observable, of} from 'rxjs';

const CATEGORIES: FaqCategory[] = [
    { id: 1, name: 'Generic Help', description: 'FAQs about generic help' } as FaqCategory,
    { id: 2, name: 'Import Data', description: 'FAQs about Importing data' } as FaqCategory,
    { id: 3, name: 'Export Data', description: 'FAQs about Exporting Data' } as FaqCategory,
    { id: 4, name: 'Bulk Edit', description: 'FAQs about Bulk Edit' } as FaqCategory,
    { id: 5, name: 'Items and Attributes', description: 'FAQs about Items and Attributes' } as FaqCategory,
    { id: 6, name: 'Users and Roles', description: 'FAQs about Users and Roles' } as FaqCategory,
    { id: 7, name: 'Scheduled Jobs', description: 'FAQs about Jobs and their scheduling' } as FaqCategory,
    { id: 8, name: 'Forums', description: 'FAQs about Forum and usage' } as FaqCategory,
    { id: 9, name: 'Dashboard and Widgets', description: 'FAQs about Dashboard and Widgets' } as FaqCategory,
    { id: 10, name: 'Views', description: 'FAQs about Views' } as FaqCategory,
    { id: 11, name: 'Pricing Structure', description: 'FAQs about Pricing Structure and Business Partners' } as FaqCategory,
    { id: 12, name: 'Settings', description: 'FAQs about generic Settings' } as FaqCategory,
];

const FAQS: Faq[] = [
    {id: 1, categoryId: 1, title: 'What about this {replace}', description: '{replace} asd asdjkj asdjkjas djkka sdjkjaasl djks jskjasd jkjsd asd',
        answer: 'sd jasjd jkjas djkk asjdjjkkasd jjksalls jdsjjsa  jdjkjs asdj jjjsdk jjaskdkjjs jjdskkasdjj sdjkkasd dsd'} as Faq,
    {id: 2, categoryId: 2, title: 'Guess what is going on', description: 'this is what is going on ',
        answer: 'asd this is the answer of what is ging on testing 123'} as Faq,
];

@Injectable()
export class HelpCenterService {

    getFaqsCategories(): Observable<FaqCategory[]> {
        return of([...CATEGORIES]);
    }

    getFaqs(categoryId: number): Observable<Faq[]> {
        const faqs: Faq[] = FAQS.map((f: Faq) => {
            const r = Math.random();
            const ff: Faq = Object.assign(f, {categoryId});
            ff.title = ff.title.replace('\{replace\}', '' + r);
            ff.description = ff.description.replace('\{replace\}', '' + r);
            ff.answer += (' ' + Math.random());
            return ff;
        });
        return of(faqs);
    }
}
