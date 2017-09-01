import { ColumnTypes } from "../../metadata/types/ColumnTypes";
import { ColumnTypeUndefinedError } from "../error/ColumnTypeUndefinedError";
import { getMetadataArgsStorage } from "../../../index";
import { PrimaryColumnCannotBeNullableError } from "../error/PrimaryColumnCannotBeNullableError";
/**
 * Column decorator is used to mark a specific class property as a table column.
 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
 * Primary columns also creates a PRIMARY KEY for this column in a db.
 */
export function PrimaryColumn(typeOrOptions, options) {
    let type;
    if (typeof typeOrOptions === "string") {
        type = typeOrOptions;
    }
    else {
        options = typeOrOptions;
    }
    return function (object, propertyName) {
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
        // check if column is not nullable, because we cannot allow a primary key to be nullable
        if (options.nullable)
            throw new PrimaryColumnCannotBeNullableError(object, propertyName);
        // implicitly set a primary to column options
        options = Object.assign({ primary: true }, options);
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
//# sourceMappingURL=PrimaryColumn.js.map