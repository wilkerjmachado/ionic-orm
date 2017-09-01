/**
 * Thrown when consumer tries to connect when he already connected.
 */
export class CannotConnectAlreadyConnectedError extends Error {
    constructor(connectionName) {
        super();
        this.name = "CannotConnectAlreadyConnectedError";
        this.message = `Cannot create a "${connectionName}" connection because connection to the database already established.`;
        this.stack = new Error().stack;
    }
}
//# sourceMappingURL=CannotConnectAlreadyConnectedError.js.map