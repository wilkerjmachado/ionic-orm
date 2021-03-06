/**
 * Thrown when consumer tries to use naming strategy that does not exist.
 */
export class NamingStrategyNotFoundError extends Error {
    constructor(strategyName, connectionName) {
        super();
        this.name = "NamingStrategyNotFoundError";
        const name = strategyName instanceof Function ? strategyName.name : strategyName;
        this.message = `Naming strategy "${name}" was not found. Looks like this naming strategy does not ` +
            `exist or it was not registered in current "${connectionName}" connection?`;
        this.stack = new Error().stack;
    }
}
//# sourceMappingURL=NamingStrategyNotFoundError.js.map