import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {WorkflowService} from '../../service/workflow-service/workflow.service';
import {finalize, map, switchMap, tap} from 'rxjs/operators';
import {
    ContinueWorkflowResult,
    WorkflowInstanceComment,
    WorkflowInstanceTask
} from '@fuyuko-common/model/workflow.model';
import {LoadingService} from '../../service/loading-service/loading.service';
import {WorkflowInstanceTaskDetailComponentEvent} from '../../component/workflow-component/workflow-instance-task-details.component';
import {
    GetCommentsFn, WorkflowInstanceCommentsComponent,
    WorkflowInstanceCommentsComponentEvent
} from '../../component/workflow-component/workflow-instance-comments.component';
import {DEFAULT_LIMIT, DEFAULT_OFFSET, LimitOffset} from '@fuyuko-common/model/limit-offset.model';
import {AuthService} from '../../service/auth-service/auth.service';
import {toNotifications} from '../../service/common.service';
import {NotificationsService} from 'angular2-notifications';

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

   continueWorkflowResult: ContinueWorkflowResult;
   disableWorkflowActions = false;

   @ViewChild('workflowInstanceCommentsComponent')
   workflowInstanceCommentsComponent: WorkflowInstanceCommentsComponent;

   constructor(private activatedRoute: ActivatedRoute,
               private workflowService: WorkflowService,
               private authService: AuthService,
               private notificationService: NotificationsService,
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
                 console.log('********************** workflowInstanceTask', workflowInstanceTask);
              }),
              finalize( () => {
                  this.ready = true;
              }),
          ).subscribe();
   }

   onWorkflowInstanceTaskDetailsEvent($event: WorkflowInstanceTaskDetailComponentEvent) {
      // todo: trigger continue workflow
       if ($event.type === 'WorkflowAction') {
           const workflowInstanceId = $event.workflowInstanceTask.workflowInstance.id;
           const user = this.authService.myself();
           const userId = user.id;
           const username = user.username;
           const stateName = $event.workflowInstanceTask.workflowInstance.currentWorkflowState;
           const workflowAction = $event.worfklowAction;
           this.workflowService.continueWorkflow(userId, username, workflowInstanceId, stateName, workflowAction)
               .pipe(
                   map(r => {
                       toNotifications(this.notificationService, r);
                       return r.payload;
                   }),
                   tap(continueWorkflowResult => {
                       this.continueWorkflowResult = continueWorkflowResult;
                       this.disableWorkflowActions = true;
                   })
               ).subscribe();
       }
   }

    onCommentEvent($event: WorkflowInstanceCommentsComponentEvent) {
       if ($event.type === 'SubmitComment') {
           const workflowInstanceId = $event.workflowInstanceId;
           const userId = this.authService.myself().id;
           const comment = $event.comment;
           this.workflowService.addComment(workflowInstanceId, userId, comment)
               .pipe(
                   tap(apiResponse => {
                       toNotifications(this.notificationService, apiResponse);
                       this.workflowInstanceCommentsComponent.reload();
                   })
               ).subscribe();
       }
    }
}
