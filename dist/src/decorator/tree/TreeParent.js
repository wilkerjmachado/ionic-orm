import { getMetadataArgsStorage } from "../../../index";
import { RelationTypes } from "../../metadata/types/RelationTypes";
/**
 * Marks a specific property of the class as a parent of the tree.
 */
export function TreeParent(options) {
    return function (object, propertyName) {
        if (!options)
            options = {};
        const reflectedType = Reflect.getMetadata("design:type", object, propertyName);
        const isLazy = reflectedType && typeof reflectedType.name === "string" && reflectedType.name.toLowerCase() === "promise";
        const args = {
            isTreeParent: true,
            target: object.constructor,
            propertyName: propertyName,
            propertyType: reflectedType,
            isLazy: isLazy,
            relationType: RelationTypes.MANY_TO_ONE,
            type: () => object.constructor,
            options: options
        };
        getMetadataArgsStorage().relations.add(args);
    };
}
//# sourceMappingURL=TreeParent.js.map