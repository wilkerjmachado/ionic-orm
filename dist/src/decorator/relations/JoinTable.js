import { getMetadataArgsStorage } from "../../../index";
/**
 * JoinTable decorator is used in many-to-many relationship to specify owner side of relationship.
 * Its also used to set a custom junction table's name, column names and referenced columns.
 */
export function JoinTable(options) {
    return function (object, propertyName) {
        options = options || {};
        const args = {
            target: object.constructor,
            propertyName: propertyName,
            name: options.name,
            joinColumn: options.joinColumn,
            inverseJoinColumn: options.inverseJoinColumn
        };
        getMetadataArgsStorage().joinTables.add(args);
    };
}
//# sourceMappingURL=JoinTable.js.map