import { RelationTypes } from "../../metadata/types/RelationTypes";
import { getMetadataArgsStorage } from "../../../index";
/**
 * Many-to-many is a type of relationship when Entity1 can have multiple instances of Entity2, and Entity2 can have
 * multiple instances of Entity1. To achieve it, this type of relation creates a junction table, where it storage
 * entity1 and entity2 ids. This is owner side of the relationship.
 */
export function ManyToMany(typeFunction, inverseSideOrOptions, options) {
    let inverseSideProperty;
    if (typeof inverseSideOrOptions === "object") {
        options = inverseSideOrOptions;
    }
    else {
        inverseSideProperty = inverseSideOrOptions;
    }
    return function (object, propertyName) {
        if (!options)
            options = {};
        const reflectedType = Reflect.getMetadata("design:type", object, propertyName);
        const isLazy = reflectedType && typeof reflectedType.name === "string" && reflectedType.name.toLowerCase() === "promise";
        const args = {
            target: object.constructor,
            propertyName: propertyName,
            propertyType: reflectedType,
            relationType: RelationTypes.MANY_TO_MANY,
            isLazy: isLazy,
            type: typeFunction,
            inverseSideProperty: inverseSideProperty,
            options: options
        };
        getMetadataArgsStorage().relations.add(args);
    };
}
//# sourceMappingURL=ManyToMany.js.map