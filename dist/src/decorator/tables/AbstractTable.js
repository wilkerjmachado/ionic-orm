import { getMetadataArgsStorage } from "../../../index";
/**
 * Abstract table is a table that contains columns and relations for all tables that will inherit this table.
 * Database table for the abstract table is not created.
 */
export function AbstractTable() {
    return function (target) {
        const args = {
            target: target,
            name: undefined,
            type: "abstract"
        };
        getMetadataArgsStorage().tables.add(args);
    };
}
//# sourceMappingURL=AbstractTable.js.map