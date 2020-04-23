import * as util from "../util/util";

export interface ActualPage<P> {
    visit(): P;
    waitForReady(): P;
    validateTitle(): P;
    verifySuccessMessageExists(): P;
    verifyErrorMessageExists(): P;
}
