import {CustomValidationContext} from "../../model/validation.model";

export const description = (): string => `0.0.2 Sample Rule #2`

export const run = (ctx: CustomValidationContext) => {
    console.log('***** Sample Rule #2 Ran ******');
}
