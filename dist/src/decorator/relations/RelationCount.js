import { getMetadataArgsStorage } from "../../../index";
/**
 * Holds a number of children in the closure table of the column.
 */
export function RelationCount(relation) {
    return function (object, propertyName) {
        // todo: need to check if property type is number?
        // const reflectedType = ColumnTypes.typeToString((Reflect as any).getMetadata("design:type", object, propertyName));
        // create and register a new column metadata
        const args = {
            target: object.constructor,
            propertyName: propertyName,
            relation: relation
        };
        getMetadataArgsStorage().relationCounts.add(args);
    };
}
//# sourceMappingURL=RelationCount.js.map