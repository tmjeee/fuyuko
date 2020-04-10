import {ApiError, ApiErrorContext} from '../model/api-error.model';

export const makeApiErrorObj = (...errors: ApiError[]): ApiErrorContext => {
    return makeApiErrorObjWithContext('default', [...errors]);
}

export const makeApiErrorObjWithContext = (context: string, errors: ApiError[]): ApiErrorContext => {
    return {
        context,
        errors: [...errors]
    }
}


export const makeApiError = (msg: string, param?: string, value?: string, location?: string): ApiError => {
   return {
       msg,
       location: (location ? location : ''),
       param: (param ? param : ''),
       value : (value ? value : '')
   } as ApiError
}
