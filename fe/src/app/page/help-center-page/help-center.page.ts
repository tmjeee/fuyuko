import {Component, OnInit} from '@angular/core';
import {FaqCategory} from '../../model/help-center.model';
import {FaqFn} from '../../component/help-center-component/help-center.component';
import {HelpCenterService} from '../../service/help-center-service/help-center.service';
import {tap} from 'rxjs/operators';


@Component({
  templateUrl: './help-center.page.html',
  styleUrls: ['./help-center.page.scss']
})
export class HelpCenterPageComponent implements OnInit {

    categories: FaqCategory[];
    faqsFn: FaqFn;

    constructor(private helpCenterFaqs: HelpCenterService) {}

    ngOnInit(): void {
        this.categories = [];
        this.helpCenterFaqs.getFaqsCategories().pipe(
            tap((c: FaqCategory[]) => this.categories = c)
        ).subscribe();
        this.faqsFn = (categoryId: number) => {
            return this.helpCenterFaqs.getFaqs(categoryId);
        };
    }
}
