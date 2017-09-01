import { ColumnTypes } from "../../metadata/types/ColumnTypes";
import { getMetadataArgsStorage } from "../../../index";
/**
 * This column will store a creation date of the inserted object.
 * Creation date is generated and inserted only once,
 * at the first time when you create an object, the value is inserted into the table, and is never touched again.
 */
export function CreateDateColumn(options) {
    return function (object, propertyName) {
        const reflectedType = ColumnTypes.typeToString(Reflect.getMetadata("design:type", object, propertyName));
        // if column options are not given then create a new empty options
        if (!options)
            options = {};
        // implicitly set a type, because this column's type cannot be anything else except date
        options = Object.assign({ type: ColumnTypes.DATETIME }, options);
        // create and register a new column metadata
        const args = {
            target: object.constructor,
            propertyName: propertyName,
            propertyType: reflectedType,
            mode: "createDate",
            options: options
        };
        getMetadataArgsStorage().columns.add(args);
    };
}
//# sourceMappingURL=CreateDateColumn.js.map