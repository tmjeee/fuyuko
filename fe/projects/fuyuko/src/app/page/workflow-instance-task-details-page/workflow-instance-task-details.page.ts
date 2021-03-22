import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {WorkflowService} from '../../service/workflow-service/workflow.service';
import {finalize, map, switchMap, tap} from 'rxjs/operators';
import {WorkflowInstanceComment, WorkflowInstanceTask} from '@fuyuko-common/model/workflow.model';
import {LoadingService} from '../../service/loading-service/loading.service';
import {WorkflowInstanceTaskDetailComponentEvent} from '../../component/workflow-component/workflow-instance-task-details.component';
import {GetCommentsFn} from '../../component/workflow-component/workflow-instance-comments.component';
import {DEFAULT_LIMIT, DEFAULT_OFFSET, LimitOffset} from '@fuyuko-common/model/limit-offset.model';

@Component({
   templateUrl: './workflow-instance-task-details.page.html',
   styleUrls: ['./workflow-instance-task-details.page.scss'],
})
export class WorkflowInstanceTaskDetailsPageComponent implements OnInit {

   ready = false;
   workflowInstanceTask: WorkflowInstanceTask;
   workflowInstanceComments: WorkflowInstanceComment[];
   workflowInstanceTaskId: number;
   getCommentFn: GetCommentsFn;
   limitOffset: LimitOffset = { limit: DEFAULT_LIMIT, offset: DEFAULT_OFFSET };

   constructor(private activatedRoute: ActivatedRoute,
               private workflowService: WorkflowService,
               private loadingService: LoadingService) { }

   ngOnInit(): void {
       const taskId = Number(this.activatedRoute.snapshot.params.workflowInstanceTaskId);
       // todo: catch error and invalid taskId

       this.getCommentFn = (workflowInstanceId: number, limitOffset: LimitOffset) => {
           return this.workflowService.getWorkflowInstanceComments(this.workflowInstanceTask.workflowInstance.id);
       };

       this.workflowService.getWorkflowInstanceTaskById(taskId)
          .pipe(
              map(r => r.payload),
              map(workflowInstanceTask => {
                 this.workflowInstanceTask = workflowInstanceTask;
              }),
              finalize( () => {
                  this.ready = true;
              }),
          ).subscribe();
   }

   onWorkflowInstanceTaskDetailsEvent($event: WorkflowInstanceTaskDetailComponentEvent) {
      // todo: trigger continue workflow
   }
}
