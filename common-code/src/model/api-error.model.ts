
export const isApiErrorContext = (err: ApiErrorContext | ApiError): err is ApiErrorContext => {
    return (err && (err as any)['context'] && (err as any)['errors'] && Array.isArray((err as any)['errors']));
}

export const isApiError = (err: ApiErrorContext | ApiError): err is ApiError => {
    return (err && (err as any)['msg']);
}

// both are build and send through express response (see error.util.ts from be code)
export interface ApiErrorContext {
    context: string,
    errors: ApiError[];
}
export interface ApiError {
    location?: string;
    msg: string;
    param?: string;
    value?: string;
}
