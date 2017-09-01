/**
 * Thrown when consumer tries to access entity manager before connection is established.
 */
export class CannotGetEntityManagerNotConnectedError extends Error {
    constructor(connectionName) {
        super();
        this.name = "CannotGetEntityManagerNotConnectedError";
        this.message = `Cannot get entity manager for "${connectionName}" connection because connection is not yet established.`;
        this.stack = new Error().stack;
    }
}
//# sourceMappingURL=CannotGetEntityManagerNotConnectedError.js.map