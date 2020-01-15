import {ApiError} from '../model/error.model';

export const makeApiErrorObj = (...errors: ApiError[]): {context: string, errors: ApiError[]} => {
    return makeApiErrorObjWithContext('default', [...errors]);
}

export const makeApiErrorObjWithContext = (context: string, errors: ApiError[]): {context: string, errors: ApiError[]} => {
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
