import { ColumnTypes } from "../../metadata/types/ColumnTypes";
import { getMetadataArgsStorage } from "../../../index";
import { PrimaryColumnCannotBeNullableError } from "../error/PrimaryColumnCannotBeNullableError";
/**
 * Column decorator is used to mark a specific class property as a table column.
 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
 * This column creates an integer PRIMARY COLUMN with generated set to true.
 * This column creates is an alias for @PrimaryColumn("int", { generated: true }).
 */
export function PrimaryGeneratedColumn(options) {
    return function (object, propertyName) {
        const reflectedType = ColumnTypes.typeToString(Reflect.getMetadata("design:type", object, propertyName));
        // if column options are not given then create a new empty options
        if (!options)
            options = {};
        // check if there is no type in column options then set the int type - by default for auto generated column
        if (!options.type)
            options = Object.assign({ type: "int" }, options);
        // check if column is not nullable, because we cannot allow a primary key to be nullable
        if (options.nullable)
            throw new PrimaryColumnCannotBeNullableError(object, propertyName);
        // implicitly set a primary and generated to column options
        options = Object.assign({ primary: true, generated: true }, options);
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
//# sourceMappingURL=PrimaryGeneratedColumn.js.map