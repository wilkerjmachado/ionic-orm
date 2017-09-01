import { getMetadataArgsStorage } from "../../index";
/**
 * Composite index must be set on entity classes and must specify entity's fields to be indexed.
 */
export function Index(nameOrFields, maybeFieldsOrOptions, maybeOptions) {
    const name = typeof nameOrFields === "string" ? nameOrFields : undefined;
    const fields = typeof nameOrFields === "string" ? maybeFieldsOrOptions : nameOrFields;
    const options = (typeof maybeFieldsOrOptions === "object" && !Array.isArray(maybeFieldsOrOptions)) ? maybeFieldsOrOptions : maybeOptions;
    return function (clsOrObject, propertyName) {
        const args = {
            target: propertyName ? clsOrObject.constructor : clsOrObject,
            name: name,
            columns: propertyName ? [propertyName] : fields,
            unique: options && options.unique ? true : false
        };
        getMetadataArgsStorage().indices.add(args);
    };
}
//# sourceMappingURL=Index.js.map