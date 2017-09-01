/**
 * Thrown when connection is trying to be created automatically from connection options found in the ormconfig.json
 * or environment variables, but failed due to missing these configurations.
 */
export class CannotDetermineConnectionOptionsError extends Error {
    constructor() {
        super();
        this.name = "CannotDetermineConnectionOptionsError";
        this.message = `Cannot create connection, because connection options are missing. ` +
            `You either need to explicitly pass connection options, either create a ormconfig.json with with connection options ` +
            `and "default" connection name, either to set proper environment variables. Also, if you are using environment-specific ` +
            `configurations in your ormconfig.json make sure your are running under correct NODE_ENV.`;
        this.stack = new Error().stack;
    }
}
//# sourceMappingURL=CannotDetermineConnectionOptionsError.js.map