/**
 * Thrown when accessed to the class with entity metadata,
 * however on that time entity metadata is not set in the class.
 */
export class EntityMetadataNotSetError extends Error {
    constructor(type, target, tableName) {
        super();
        this.name = "EntityMetadataNotSetError";
        const targetMessage = target ? ` for ${target instanceof Function ? target.constructor.name : target}` : "";
        const tableNameMessage = tableName ? ` with ${tableName} table name` : "";
        this.message = "Entity metadata" + targetMessage + tableNameMessage + " is not set in " + type.constructor.name;
    }
}
//# sourceMappingURL=EntityMetadataNotSetError.js.map