import { ColumnTypes } from "../../metadata/types/ColumnTypes";
import { getMetadataArgsStorage } from "../../../index";
/**
 * This column will store a number - version of the entity.
 * Every time your entity will be persisted, this number will be increased by one -
 * so you can organize visioning and update strategies of your entity.
 */
export function VersionColumn(options) {
    return function (object, propertyName) {
        const reflectedType = ColumnTypes.typeToString(Reflect.getMetadata("design:type", object, propertyName));
        // if column options are not given then create a new empty options
        if (!options)
            options = {};
        // implicitly set a type, because this column's type cannot be anything else except date
        options = Object.assign({ type: ColumnTypes.INTEGER }, options);
        // todo: check if reflectedType is number too
        // create and register a new column metadata
        const args = {
            target: object.constructor,
            propertyName: propertyName,
            propertyType: reflectedType,
            mode: "version",
            options: options
        };
        getMetadataArgsStorage().columns.add(args);
    };
}
//# sourceMappingURL=VersionColumn.js.map