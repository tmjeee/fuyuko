

type PropertiesOnly<C> = {
    // tslint:disable-next-line:ban-types
    [Key in keyof C]: C[Key] extends Function ? never : Key
};
type PropertiesNameOnly1<C> = PropertiesOnly<C>[keyof C];
type PropertiesNameOnly2<C, X = PropertiesOnly<C>> = X[keyof X];
type PropertiesOnlyType<T> = Pick<T, PropertiesNameOnly2<T>>;
export type NgChanges<C, T = PropertiesOnlyType<C>> = {
    [Key in keyof T]: {
        previousValue: T[Key],
        currentValue: T[Key],
        firstChange: boolean;
        isFirstChange(): boolean;
    }
};


