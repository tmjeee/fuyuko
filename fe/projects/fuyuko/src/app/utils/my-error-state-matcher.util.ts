import {ErrorStateMatcher} from '@angular/material/core';
import {FormControl, FormGroupDirective, NgForm} from '@angular/forms';


export class MyErrorStateMatcher implements  ErrorStateMatcher {
    isErrorState(control: FormControl, form: FormGroupDirective | NgForm ): boolean {
        return !!((!control.pristine) && (control.dirty || form.invalid));
    }
}
