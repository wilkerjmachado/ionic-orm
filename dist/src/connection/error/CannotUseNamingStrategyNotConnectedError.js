/**
 * Thrown when consumer tries to change used naming strategy after connection is established.
 */
export class CannotUseNamingStrategyNotConnectedError extends Error {
    constructor(connectionName) {
        super();
        this.name = "CannotUseNamingStrategyNotConnectedError";
        this.message = `Cannot use a given naming strategy for "${connectionName}" connection because connection to the database already established.`;
        this.stack = new Error().stack;
    }
}
//# sourceMappingURL=CannotUseNamingStrategyNotConnectedError.js.map