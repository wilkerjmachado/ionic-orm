/**
 * Thrown when consumer tries close not opened connection.
 */
export class CannotCloseNotConnectedError extends Error {
    constructor(connectionName) {
        super();
        this.name = "CannotCloseNotConnectedError";
        this.message = `Cannot close "${connectionName}" connection because connection is not yet established.`;
        this.stack = new Error().stack;
    }
}
//# sourceMappingURL=CannotCloseNotConnectedError.js.map