import { RelationTypes } from "../../metadata/types/RelationTypes";
import { getMetadataArgsStorage } from "../../../index";
/**
 * Many-to-one relation allows to create type of relation when Entity1 can have single instance of Entity2, but
 * Entity2 can have a multiple instances of Entity1. Entity1 is an owner of the relationship, and storages Entity2 id
 * on its own side.
 */
export function ManyToOne(typeFunction, inverseSideOrOptions, options) {
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
            relationType: RelationTypes.MANY_TO_ONE,
            isLazy: isLazy,
            type: typeFunction,
            inverseSideProperty: inverseSideProperty,
            options: options
        };
        getMetadataArgsStorage().relations.add(args);
    };
}
//# sourceMappingURL=ManyToOne.js.map