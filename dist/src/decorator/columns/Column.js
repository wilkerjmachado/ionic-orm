import { ColumnTypeUndefinedError } from "../error/ColumnTypeUndefinedError";
import { GeneratedOnlyForPrimaryError } from "../error/GeneratedOnlyForPrimaryError";
import { getMetadataArgsStorage } from "../../../index";
import { ColumnTypes } from "../../metadata/types/ColumnTypes";
/**
 * Column decorator is used to mark a specific class property as a table column.
 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
 */
export function Column(typeOrOptions, options) {
    let type;
    if (typeof typeOrOptions === "string") {
        type = typeOrOptions;
    }
    else {
        options = typeOrOptions;
    }
    return function (object, propertyName) {
        // todo: need to store not string type, but original type instead? (like in relation metadata)
        const reflectedType = ColumnTypes.typeToString(Reflect.getMetadata("design:type", object, propertyName));
        // if type is not given implicitly then try to guess it
        if (!type)
            type = ColumnTypes.determineTypeFromFunction(Reflect.getMetadata("design:type", object, propertyName));
        // if column options are not given then create a new empty options
        if (!options)
            options = {};
        // check if there is no type in column options then set type from first function argument, or guessed one
        if (!options.type)
            options = Object.assign({ type: type }, options);
        // if we still don't have a type then we need to give error to user that type is required
        if (!options.type)
            throw new ColumnTypeUndefinedError(object, propertyName);
        // check if auto increment is not set for simple column
        if (options.generated)
            throw new GeneratedOnlyForPrimaryError(object, propertyName);
        // create and register a new column metadata
        const args = {
            target: object.constructor,
            propertyName: propertyName,
            propertyType: reflectedType,
            mode: "regular",
            options: options
        };
        getMetadataArgsStorage().columns.add(args);
    };
}
//# sourceMappingURL=Column.js.map