import { getMetadataArgsStorage } from "../../index";
/**
 * Decorator registers a new naming strategy to be used in naming things.
 */
export function NamingStrategy(name) {
    return function (target) {
        const strategyName = name ? name : target.name;
        const args = {
            target: target,
            name: strategyName
        };
        getMetadataArgsStorage().namingStrategies.add(args);
    };
}
//# sourceMappingURL=NamingStrategy.js.map