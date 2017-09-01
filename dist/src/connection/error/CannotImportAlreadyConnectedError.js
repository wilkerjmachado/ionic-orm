/**
 * Thrown when consumer tries to import entities / entity schemas / subscribers / naming strategies after connection
 * is established.
 */
export class CannotImportAlreadyConnectedError extends Error {
    constructor(importStuff, connectionName) {
        super();
        this.name = "CannotImportAlreadyConnected";
        this.message = `Cannot import ${importStuff} for "${connectionName}" connection because connection to the database already established.`;
        this.stack = new Error().stack;
    }
}
//# sourceMappingURL=CannotImportAlreadyConnectedError.js.map