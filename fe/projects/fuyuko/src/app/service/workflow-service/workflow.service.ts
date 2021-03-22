import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
    Workflow,
    WorkflowDefinition,
    WorkflowInstanceAction, WorkflowInstanceComment, WorkflowInstanceTask,
    WorkflowInstanceTaskStatus,
    WorkflowInstanceType
} from '@fuyuko-common/model/workflow.model';
import config from '../../utils/config.util';
import {ApiResponse, PaginableApiResponse} from '@fuyuko-common/model/api-response.model';
import {map} from 'rxjs/operators';
import {View} from '@fuyuko-common/model/view.model';
import {toQuery} from '../../utils/pagination.utils';
import {DEFAULT_LIMIT, DEFAULT_OFFSET, LimitOffset} from '@fuyuko-common/model/limit-offset.model';

const URL_ALL_WORKFLOW_DEFINITIONS = () => `${config().api_host_url}/workflow/definitions`;
const URL_CREATE_WORKFLOW = () => `${config().api_host_url}/workflow/workflow`;
const URL_ALL_WORKFLOWS_BY_VIEW = (viewId: number) => `${config().api_host_url}/workflow/workflow/${viewId}`;
const URL_ALL_WORKFLOWS_BY_VIEW_ACTION_AND_TYPE = (viewId: number, action: WorkflowInstanceAction, type: WorkflowInstanceType) =>
    `${config().api_host_url}/workflow/view/${viewId}/action/${action}/type/${type}`;
const URL_WORKFLOW_INSTANCE_TASK_FOR_USER_BY_STATUS = (userId: number, status: WorkflowInstanceTaskStatus, limitOffset?: LimitOffset) =>
    `${config().api_host_url}/workflow-instance/user/${userId}/status/${status}?${toQuery(limitOffset)}`;
const URL_GET_WORKFLOW_INSTANCE_TASK_BY_ID = (workflowInstanceTaskId: number) =>
    `${config().api_host_url}/workflow-instance/task/${workflowInstanceTaskId}`;
const URL_GET_WORKFLOW_INSTANCE_COMMENTS = (workflowInstanceId: number, limitOffset: LimitOffset) =>
    `${config().api_host_url}/workflow-instance/${workflowInstanceId}/comments${toQuery(limitOffset)}`;


@Injectable()
export class WorkflowService {

    constructor(private httpClient: HttpClient) { }

    getAllWorkflowDefinitions(): Observable<WorkflowDefinition[]> {
        return this.httpClient
            .get<ApiResponse<WorkflowDefinition[]>>(URL_ALL_WORKFLOW_DEFINITIONS())
            .pipe(
                map((r: ApiResponse<View[]>) => r.payload)
            )
        ;
    }


    createWorkflow(workflowName: string, viewId: number, workflowAction: WorkflowInstanceAction,
                   workflowType: WorkflowInstanceType, workflowDefinitionId: number,
                   workflowAttributeIds: number[]): Observable<ApiResponse> {
        return this.httpClient
            .post<ApiResponse>(URL_CREATE_WORKFLOW(), {
                workflowName, viewId, workflowAction, workflowType, workflowDefinitionId,
                workflowAttributeIds,
            });
    }

    getWorkflowsByView(viewId: number): Observable<ApiResponse<Workflow[]>> {
        return this.httpClient
            .get<ApiResponse<Workflow[]>>(URL_ALL_WORKFLOWS_BY_VIEW(viewId));
    }

    getWorkflowsByViewActionAndType(viewId: number, action: WorkflowInstanceAction, type: WorkflowInstanceType):
        Observable<ApiResponse<Workflow[]>> {
        return this.httpClient
            .get<ApiResponse<Workflow[]>>(URL_ALL_WORKFLOWS_BY_VIEW_ACTION_AND_TYPE(viewId, action, type));
    }

    getWorkflowInstanceTaskForUserByStatus(userId: number, status: WorkflowInstanceTaskStatus, limitOffset?: LimitOffset):
        Observable<ApiResponse<WorkflowInstanceTask[]>> {
        return this.httpClient
            .get<PaginableApiResponse<WorkflowInstanceTask[]>>(URL_WORKFLOW_INSTANCE_TASK_FOR_USER_BY_STATUS(userId, status, limitOffset));
    }

    getWorkflowInstanceTaskById(workflowInstanceTaskId: number): Observable<ApiResponse<WorkflowInstanceTask>> {
        return this.httpClient
            .get<ApiResponse<WorkflowInstanceTask>>(URL_GET_WORKFLOW_INSTANCE_TASK_BY_ID(workflowInstanceTaskId));
    }

    getWorkflowInstanceComments(workflowInstanceId: number, limitOffset?: LimitOffset):
        Observable<PaginableApiResponse<WorkflowInstanceComment[]>> {
        return this.httpClient
            .get<PaginableApiResponse<WorkflowInstanceComment[]>>(URL_GET_WORKFLOW_INSTANCE_COMMENTS(workflowInstanceId, limitOffset));
    }
}
