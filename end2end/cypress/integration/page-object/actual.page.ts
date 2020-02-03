import * as util from "../util/util";

export interface ActualPage<P> {
    visit(): P;
    validateTitle(): P;
    verifySuccessMessageExists(): P;
    verifyErrorMessageExists(): P;
}
