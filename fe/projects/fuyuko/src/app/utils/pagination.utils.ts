import {DEFAULT_LIMIT, LimitOffset} from '@fuyuko-common/model/limit-offset.model';
import {PageEvent} from '@angular/material/paginator';


export const toQuery = (limitOffset: LimitOffset): string => {
   if (limitOffset) {
      return `limit=${limitOffset.limit}&offset=${limitOffset.offset} `;
   }
   return ``;
};

export class Pagination {
    limit: number;
    offset: number;
    total: number;

    private readonly INC: number = DEFAULT_LIMIT;
    pageSizeOptions: number[] = [5, 10, 30, 50, 100];

    constructor() {
        this.reset();
    }

    nextPage() {
        if (this.total > (this.offset + this.limit)) {
            this.offset += this.limit;
        }
    }

    previousPage() {
        if (this.offset > 0) {
            this.offset = (this.offset - this.limit > 0) ? (this.offset - this.limit) : 0;
        }
    }

    reset() {
        this.limit = this.INC;
        this.offset = 0;
        this.total = this.INC;
    }

    limitOffset(): LimitOffset {
        return {
            limit: this.limit, offset: this.offset
        };
    }

    // used when we get back a PaginableApiResponse
    update(u: {limit: number, offset: number, total: number}) {
        this.limit = u.limit;
        this.offset = u.offset;
        this.total = u.total;
    }

    // used when we got an event from Pagination component
    updateFromPageEvent(pageEvent: PageEvent) {
        const limit: number  = pageEvent.pageSize;
        const offset: number = (pageEvent.pageIndex * pageEvent.pageSize);
        const total: number  = pageEvent.length;
        this.update({
            limit, offset, total
        });
    }
}
