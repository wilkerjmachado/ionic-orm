import { getMetadataArgsStorage } from "../../../index";
/**
 * This decorators is used on the entities that must be embedded into the tables.
 */
export function EmbeddableTable() {
    return function (target) {
        const args = {
            target: target,
            type: "embeddable",
            orderBy: undefined
        };
        getMetadataArgsStorage().tables.add(args);
    };
}
//# sourceMappingURL=EmbeddableTable.js.map