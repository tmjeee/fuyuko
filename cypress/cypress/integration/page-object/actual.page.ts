
export interface ActualPage<P> {
    visit(): P;
    validateTitle(): P;
}
