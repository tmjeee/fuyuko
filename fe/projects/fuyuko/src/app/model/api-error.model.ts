

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
