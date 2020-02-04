import {CustomValidationContext} from "../../model/validation.model";

export const description = (): string => `0.0.1 Sample Rule #1`

export const run = (ctx: CustomValidationContext) => {
    console.log('***** Sample Rule #1 Ran ******');
}
