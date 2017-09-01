export declare class OrmUtils {
    static groupBy<T, R>(array: T[], propertyCallback: (item: T) => R): {
        id: R;
        items: T[];
    }[];
    /**
     * Transforms given value into boolean value.
     */
    static toBoolean(value: any): boolean;
}
