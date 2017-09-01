import { getMetadataArgsStorage } from "../../../index";
/**
 * Special type of the table used in the class-table inherited tables.
 */
export function ClassTableChild(tableName, options) {
    return function (target) {
        const args = {
            target: target,
            name: tableName,
            type: "class-table-child",
            orderBy: options && options.orderBy ? options.orderBy : undefined,
            skipSchemaSync: !!(options && options.skipSchemaSync === true)
        };
        getMetadataArgsStorage().tables.add(args);
    };
}
//# sourceMappingURL=ClassTableChild.js.map