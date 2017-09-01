import { getMetadataArgsStorage } from "../../../index";
import { ColumnTypes } from "../../metadata/types/ColumnTypes";
/**
 * Creates a "level"/"length" column to the table that holds a closure table.
 */
export function TreeLevelColumn() {
    return function (object, propertyName) {
        const reflectedType = ColumnTypes.typeToString(Reflect.getMetadata("design:type", object, propertyName));
        // implicitly set a type, because this column's type cannot be anything else except number
        const options = { type: ColumnTypes.INTEGER };
        // create and register a new column metadata
        const args = {
            target: object.constructor,
            propertyName: propertyName,
            propertyType: reflectedType,
            mode: "treeLevel",
            options: options
        };
        getMetadataArgsStorage().columns.add(args);
    };
}
//# sourceMappingURL=TreeLevelColumn.js.map