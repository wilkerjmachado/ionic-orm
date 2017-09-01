import { getMetadataArgsStorage } from "../../../index";
import { RelationTypes } from "../../metadata/types/RelationTypes";
/**
 * Marks a specific property of the class as a children of the tree.
 */
export function TreeChildren(options) {
    return function (object, propertyName) {
        if (!options)
            options = {};
        const reflectedType = Reflect.getMetadata("design:type", object, propertyName);
        const isLazy = reflectedType && typeof reflectedType.name === "string" && reflectedType.name.toLowerCase() === "promise";
        // add one-to-many relation for this 
        const args = {
            isTreeChildren: true,
            target: object.constructor,
            propertyName: propertyName,
            propertyType: reflectedType,
            isLazy: isLazy,
            relationType: RelationTypes.ONE_TO_MANY,
            type: () => object.constructor,
            options: options
        };
        getMetadataArgsStorage().relations.add(args);
    };
}
//# sourceMappingURL=TreeChildren.js.map