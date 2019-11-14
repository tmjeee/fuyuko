

export interface Paginable<T> {
    total: number;
    limit: number;
    offset: number;
    payload: T[];
}
