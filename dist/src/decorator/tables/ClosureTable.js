import { getMetadataArgsStorage } from "../../../index";
/**
 * Used on a tables that stores its children in a tree using closure deisgn pattern.
 */
export function ClosureTable(name, options) {
    return function (target) {
        const args = {
            target: target,
            name: name,
            type: "closure",
            orderBy: options && options.orderBy ? options.orderBy : undefined,
            skipSchemaSync: !!(options && options.skipSchemaSync === true)
        };
        getMetadataArgsStorage().tables.add(args);
    };
}
//# sourceMappingURL=ClosureTable.js.map