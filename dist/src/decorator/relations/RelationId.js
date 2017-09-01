import { getMetadataArgsStorage } from "../../../index";
/**
 * Special decorator used to extract relation id into separate entity property.
 */
export function RelationId(relation) {
    return function (object, propertyName) {
        const args = {
            target: object.constructor,
            propertyName: propertyName,
            relation: relation
        };
        getMetadataArgsStorage().relationIds.add(args);
    };
}
//# sourceMappingURL=RelationId.js.map