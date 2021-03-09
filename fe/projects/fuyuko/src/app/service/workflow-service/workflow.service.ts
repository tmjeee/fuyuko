import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Workflow, WorkflowDefinition, WorkflowInstanceAction, WorkflowInstanceType} from '../../model/workflow.model';
import config from '../../utils/config.util';
import {ApiResponse} from '../../model/api-response.model';
import {map} from 'rxjs/operators';
import {View} from '../../model/view.model';

const URL_ALL_WORKFLOW_DEFINITIONS = () => `${config().api_host_url}/workflow/definitions`;
const URL_CREATE_WORKFLOW = () => `${config().api_host_url}/workflow/workflow`;
const URL_ALL_WORKFLOWS_BY_VIEW = (viewId: number) => `${config().api_host_url}/workflow/workflow/${viewId}`;
const URL_ALL_WORKFLOWS_BY_VIEW_ACTION_AND_TYPE = (viewId: number, action: WorkflowInstanceAction, type: WorkflowInstanceType) =>
    `${config().api_host_url}/workflow/view/${viewId}/action/${action}/type/${type}`;

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
}
