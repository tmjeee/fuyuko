import {Component, Input, OnInit} from '@angular/core';
import {Faq, FaqCategory} from '../../model/help-center.model';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

export type FaqFn = (categoryId: number) => Observable<Faq[]>;

@Component({
    selector: 'app-help-center',
    templateUrl: './help-center.component.html',
    styleUrls: ['./help-center.component.scss']
})
export class HelpCenterComponent implements OnInit {

    @Input() categories: FaqCategory[];
    @Input() faqsFn: FaqFn;

    loadingFaqs: boolean;
    faqs: Faq[];

    constructor() { }

    ngOnInit(): void {
        this.loadingFaqs = false;
        this.faqs = [];
    }

    onFaqCategoryClicked($event: MouseEvent, category: FaqCategory) {
        this.loadingFaqs = true;
        this.faqsFn(category.id).pipe(
            tap((f: Faq[]) => {
               this.faqs = f;
               this.loadingFaqs = false;
            })
        ).subscribe();
    }
}
