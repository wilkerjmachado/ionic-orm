import { getMetadataArgsStorage } from "../../../index";
/**
 * Sets what kind of table-inheritance table will use.
 */
export function TableInheritance(type) {
    return function (target) {
        const args = {
            target: target,
            type: type
        };
        getMetadataArgsStorage().inheritances.add(args);
    };
}
//# sourceMappingURL=TableInheritance.js.map