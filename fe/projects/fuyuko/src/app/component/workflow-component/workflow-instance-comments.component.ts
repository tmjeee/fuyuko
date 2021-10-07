import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {WorkflowInstanceComment} from '@fuyuko-common/model/workflow.model';
import {DEFAULT_LIMIT, DEFAULT_OFFSET, LimitOffset} from '@fuyuko-common/model/limit-offset.model';
import {PaginableApiResponse} from '@fuyuko-common/model/api-response.model';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {PaginationComponentEvent} from '../pagination-component/pagination.component';
import {Pagination} from '../../utils/pagination.utils';

export type GetCommentsFn = (workflowInstanceId: number, limitOffset: LimitOffset) =>
    Observable<PaginableApiResponse<WorkflowInstanceComment[]>>;

export interface WorkflowInstanceCommentsComponentEvent {
    type: 'SubmitComment';
    comment: string;
    workflowInstanceId: number;
}

@Component({
    selector: 'app-workflow-instance-comments',
    templateUrl: './workflow-instance-comments.component.html',
    styleUrls: ['./workflow-instance-comments.component.scss'],
    exportAs: 'component',
})
export class WorkflowInstanceCommentsComponent implements OnInit {

    editMode = false;

    pagination: Pagination;

    @Input() workflowInstanceId!: number;
    @Input() getCommentFn!: GetCommentsFn;

    @ViewChild('textAreaElement') textAreaElementRef!: ElementRef<HTMLTextAreaElement>;

    formGroup: FormGroup;
    formControlComment: FormControl;

    comments: WorkflowInstanceComment[] = [];

    @Output() events: EventEmitter<WorkflowInstanceCommentsComponentEvent> = new EventEmitter();

    constructor(private formBuilder: FormBuilder) {
        this.pagination = new Pagination();
        this.formControlComment = formBuilder.control('', [Validators.required]);
        this.formGroup = formBuilder.group({
            comment: this.formControlComment
        });
    }

    ngOnInit(): void {
        this.reload();
    }

    submitComment() {
        const r: WorkflowInstanceCommentsComponentEvent = {
            type: 'SubmitComment',
            comment: this.formControlComment.value,
            workflowInstanceId: this.workflowInstanceId
        };
        this.events.emit(r);
    }

    reload() {
        this.pagination.firstPage();
        this.getCommentFn(this.workflowInstanceId, this.pagination.limitOffset())
            .pipe(
                map(r => r.payload),
                tap( comments => {
                    this.comments = comments ?? [];
                })
            ).subscribe();
    }

    enterEditMode(editMode: boolean) {
        this.editMode = editMode;
        if (editMode) {
            setTimeout(() => {
                this.textAreaElementRef.nativeElement.focus();
            });
        }
    }


    onPaginationEvent(event: PaginationComponentEvent) {
        this.pagination.updateFromPageEvent(event.pageEvent);
    }
}
