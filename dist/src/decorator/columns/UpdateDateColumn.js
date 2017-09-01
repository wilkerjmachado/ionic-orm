import { ColumnTypes } from "../../metadata/types/ColumnTypes";
import { getMetadataArgsStorage } from "../../../index";
/**
 * This column will store an update date of the updated object.
 * This date is being updated each time you persist the object.
 */
export function UpdateDateColumn(options) {
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
            mode: "updateDate",
            options: options
        };
        getMetadataArgsStorage().columns.add(args);
    };
}
//# sourceMappingURL=UpdateDateColumn.js.map