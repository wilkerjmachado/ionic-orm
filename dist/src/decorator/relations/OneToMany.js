import { RelationTypes } from "../../metadata/types/RelationTypes";
import { getMetadataArgsStorage } from "../../../index";
/**
 * One-to-many relation allows to create type of relation when Entity2 can have multiple instances of Entity1.
 * Entity1 have only one Entity2. Entity1 is an owner of the relationship, and storages Entity2 id on its own side.
 */
export function OneToMany(typeFunction, inverseSideOrOptions, options) {
    let inverseSideProperty;
    if (typeof inverseSideOrOptions === "object") {
        options = inverseSideOrOptions;
    }
    else {
        inverseSideProperty = inverseSideOrOptions;
    }
    // todo: for OneToMany having inverse side is required because otherwise its not possible to do anything (selections/persisment)
    // todo: validate it somehow?
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
            relationType: RelationTypes.ONE_TO_MANY,
            type: typeFunction,
            inverseSideProperty: inverseSideProperty,
            options: options
        };
        getMetadataArgsStorage().relations.add(args);
    };
}
//# sourceMappingURL=OneToMany.js.map