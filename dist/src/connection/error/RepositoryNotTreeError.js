/**
 * Thrown when repository for the given class is not found.
 */
export class RepositoryNotTreeError extends Error {
    constructor(entityClass) {
        super();
        this.name = "RepositoryNotTreeError";
        const targetName = typeof entityClass === "function" && entityClass.name ? entityClass.name : entityClass;
        this.message = `Repository of the "${targetName}" class is not a TreeRepository. Try to use @ClosureTable decorator instead of @Table.`;
        this.stack = new Error().stack;
    }
}
//# sourceMappingURL=RepositoryNotTreeError.js.map