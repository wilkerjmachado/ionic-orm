/**
 * Thrown when consumer tries to get connection that does not exist.
 */
export class ConnectionNotFoundError extends Error {
    constructor(name) {
        super();
        this.name = "ConnectionNotFoundError";
        this.message = `Connection "${name}" was not found.`;
        this.stack = new Error().stack;
    }
}
//# sourceMappingURL=ConnectionNotFoundError.js.map