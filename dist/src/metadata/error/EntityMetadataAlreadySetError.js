/**
 * Thrown when user tries to execute operation that requires connection to be established.
 */
export class EntityMetadataAlreadySetError extends Error {
    constructor(type, target, tableName) {
        super();
        this.name = "EntityMetadataAlreadySetError";
        const targetMessage = target ? ` for ${target instanceof Function ? target.constructor.name : target}` : "";
        const tableNameMessage = tableName ? ` with ${tableName} table name` : "";
        this.message = "Entity metadata" + targetMessage + tableNameMessage + " has been already set to this " + type.constructor.name;
    }
}
//# sourceMappingURL=EntityMetadataAlreadySetError.js.map