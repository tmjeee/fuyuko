export class MyErrorStateMatcher {
    isErrorState(control, form) {
        return (!control.pristine) && (control.dirty || form.invalid);
    }
}
//# sourceMappingURL=my-error-state-matcher.util.js.map