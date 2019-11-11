import {ApiError} from '../model/error.model';

export const makeApiErrorObj = (...errors: ApiError[]): {errors: ApiError[]} => {
    return {
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
