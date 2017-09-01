/**
 * Thrown when consumer tries to recreate connection with the same name, but previous connection was not closed yet.
 */
export class AlreadyHasActiveConnectionError extends Error {
    constructor(connectionName) {
        super();
        this.name = "AlreadyHasActiveConnectionError";
        this.message = `Cannot create a new connection named "${connectionName}", because connection with such name ` +
            `already exist and it now has an active connection session.`;
        this.stack = new Error().stack;
    }
}
//# sourceMappingURL=AlreadyHasActiveConnectionError.js.map