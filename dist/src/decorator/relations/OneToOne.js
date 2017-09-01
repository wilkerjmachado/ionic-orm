import { RelationTypes } from "../../metadata/types/RelationTypes";
import { getMetadataArgsStorage } from "../../../index";
/**
 * One-to-one relation allows to create direct relation between two entities. Entity1 have only one Entity2.
 * Entity1 is an owner of the relationship, and storages Entity1 id on its own side.
 */
export function OneToOne(typeFunction, inverseSideOrOptions, options) {
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
            isLazy: isLazy,
            relationType: RelationTypes.ONE_TO_ONE,
            type: typeFunction,
            inverseSideProperty: inverseSideProperty,
            options: options
        };
        getMetadataArgsStorage().relations.add(args);
    };
}
//# sourceMappingURL=OneToOne.js.map