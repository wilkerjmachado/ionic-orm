import { getMetadataArgsStorage } from "../../index";
/**
 * If entity is a child table of some table, it should have a discriminator value.
 * This decorator sets custom discriminator value for the entity.
 */
export function DiscriminatorValue(value) {
    return function (target) {
        const args = {
            target: target,
            value: value
        };
        getMetadataArgsStorage().discriminatorValues.add(args);
    };
}
//# sourceMappingURL=DiscriminatorValue.js.map