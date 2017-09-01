/**
 * Thrown when consumer tries to sync a database schema after connection is established
 */
export class CannotSyncNotConnectedError extends Error {
    constructor(connectionName) {
        super();
        this.name = "CannotSyncNotConnectedError";
        this.message = `Cannot sync schema of the "${connectionName}" connection because connection is not yet established.`;
        this.stack = new Error().stack;
    }
}
//# sourceMappingURL=CannotSyncNotConnectedError.js.map