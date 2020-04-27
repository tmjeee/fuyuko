import * as util from "../util/util";

export interface ActualPage<P> {
    visit(): P;
    waitForReady(pageName: string): P;
    validateTitle(): P;
    verifySuccessMessageExists(): P;
    verifyErrorMessageExists(): P;
}
