import {Component, Input, OnInit} from "@angular/core";
import {AUDIT_CATEGORIES, AuditCategory, AuditLog} from "../../model/audit-log.model";
import {Level, LEVELS} from "../../model/level.model";
import {FormBuilder, FormControl} from "@angular/forms";
import {BehaviorSubject, Observable, of} from "rxjs";
import {User} from "../../model/user.model";
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {audit, debounceTime, tap} from "rxjs/operators";
import {Pagination} from "../../utils/pagination.utils";
import {LimitOffset} from "../../model/limit-offset.model";
import {PaginationComponentEvent} from "../pagination-component/pagination.component";
import {PaginableApiResponse} from "../../model/api-response.model";

export type FindAuditLogsFn = (category: AuditCategory, level: Level, userId: number, log: string, limitOffset: LimitOffset) => Observable<PaginableApiResponse<AuditLog[]>>;
export type FindUsersFn = (username: string) => Observable<User[]>;


export class AuditLogDataSource extends DataSource<AuditLog> {

    subject: BehaviorSubject<AuditLog[]> = new BehaviorSubject<AuditLog[]>([]);

    connect(collectionViewer: CollectionViewer): Observable<AuditLog[] | ReadonlyArray<AuditLog>> {
        return this.subject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.subject.complete();
    }

    update(auditLogs: AuditLog[]) {
        this.subject.next(auditLogs);
    }
}

@Component({
   selector: 'app-audit-log',
   templateUrl: './audit-log.component.html',
   styleUrls: ['./audit-log.component.scss']
})
export class AuditLogComponent implements OnInit {

   @Input() findAuditLogsFn: FindAuditLogsFn;
   @Input() findUsersFn: FindUsersFn;


   AUDIT_CATEGORIES: AuditCategory[] = [...AUDIT_CATEGORIES];
   LEVELS: Level[] = [...LEVELS];

   formControlAuditCategorySearch: FormControl;
   formControlLevelSearch: FormControl;
   formControlUsernameSearch: FormControl;
   formControlLogSearch: FormControl;

   filteredUsers: Observable<User[]> = of([]);
   dataSource: AuditLogDataSource;
   displayedColumns: string[];
   pagination: Pagination;
   usernameDisplayWith: (value: any) => string;


   constructor(private formBuilder: FormBuilder) {
       this.displayedColumns = ['id', 'category', 'level', 'username', 'creationDate', 'log'];
       this.formControlAuditCategorySearch = formBuilder.control('', []);
       this.formControlLevelSearch = formBuilder.control('', []);
       this.formControlUsernameSearch = formBuilder.control('', []);
       this.formControlLogSearch = formBuilder.control('', []);
       this.usernameDisplayWith = (value: any): string => {
           if(typeof value == 'string') {
               return value;
           }
           if (value.id == -1) { // search for unknown user
               return "Unknown";
           }
           return (value as User).username;
       };
   }

    ngOnInit(): void {
       this.dataSource = new AuditLogDataSource();
       this.pagination = new Pagination();
       this.formControlUsernameSearch.valueChanges.pipe(
           debounceTime(1000),
           tap((username: string) => {
               this.filteredUsers = this.findUsersFn(username);
           })
       ).subscribe();
       this.reload();
    }

    reload() {
        const category: AuditCategory = this.formControlAuditCategorySearch.value;
        const level: Level = this.formControlLevelSearch.value;
        const user: User = this.formControlUsernameSearch.value;
        const log: string = this.formControlLogSearch.value;

        this.findAuditLogsFn(category, level, (user ? user.id : null), log, this.pagination.limitOffset()).pipe(
            tap((r: PaginableApiResponse<AuditLog[]>) => {
                this.dataSource.update(r.payload);
                this.pagination.update({
                    limit: r.limit,
                    offset: r.offset,
                    total: r.total
                });
            })
        ).subscribe();
    }

    onSearchSubmit() {
       this.reload();
    }

    onPaginationEvent($event: PaginationComponentEvent) {
       this.pagination.updateFromPageEvent($event.pageEvent);
       this.reload();
    }
}