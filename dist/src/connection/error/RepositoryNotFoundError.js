/**
 * Thrown when repository for the given class is not found.
 */
export class RepositoryNotFoundError extends Error {
    constructor(connectionName, entityClass) {
        super();
        this.name = "RepositoryNotFoundError";
        const targetName = typeof entityClass === "function" && entityClass.name ? entityClass.name : entityClass;
        this.message = `No repository for "${targetName}" was found. Looks like this entity is not registered in ` +
            `current "${connectionName}" connection?`;
        this.stack = new Error().stack;
    }
}
//# sourceMappingURL=RepositoryNotFoundError.js.map