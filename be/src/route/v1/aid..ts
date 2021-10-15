import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {WorkflowTriggerResult} from '@fuyuko-common/model/workflow.model';

export const markAsWorkflow = <T>(apiResponse: ApiResponse<T>): ApiResponse<T> => {
    (apiResponse as any)['isWorkflow'] = true;
    return apiResponse;
}

export const isWorkflow = (apiResponse: ApiResponse<WorkflowTriggerResult[] | any>): apiResponse is ApiResponse<WorkflowTriggerResult[]> => {
    return !!(apiResponse as any)['isWorkflow'];
}

export const toHttpStatus = (apiResponse: ApiResponse<any>): number => {
    return apiResponse.messages.reduce((status, msg) => {
        switch (msg.status) {
            case 'SUCCESS':
            case 'INFO':
            case 'WARN':
                return status;
            case 'ERROR':
                return 400;
        }
       return status;
    }, 200);
}
