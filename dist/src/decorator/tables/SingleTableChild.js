import { getMetadataArgsStorage } from "../../../index";
/**
 * Special type of the table used in the single-table inherited tables.
 */
export function SingleTableChild() {
    return function (target) {
        const args = {
            target: target,
            name: undefined,
            type: "single-table-child",
            orderBy: undefined
        };
        getMetadataArgsStorage().tables.add(args);
    };
}
//# sourceMappingURL=SingleTableChild.js.map