/**
 * Performs logging of the events in TypeORM.
 */
export class Logger {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(options) {
        this.options = options;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Logs query and parameters used in it.
     */
    logQuery(query, parameters) {
        if (this.options.logQueries /*|| process.env.LOGGER_CLI_SCHEMA_SYNC*/)
            this.log("info", `executing query: ${query}${parameters && parameters.length ? " -- PARAMETERS: " + JSON.stringify(parameters) : ""}`);
    }
    /**
     * Logs query that failed.
     */
    logFailedQuery(query, parameters) {
        if (this.options.logQueries || this.options.logOnlyFailedQueries /*|| process.env.LOGGER_CLI_SCHEMA_SYNC*/)
            this.log("error", `query failed: ${query}${parameters && parameters.length ? " -- PARAMETERS: " + JSON.stringify(parameters) : ""}`);
    }
    /**
     * Logs failed query's error.
     */
    logQueryError(error) {
        if (this.options.logFailedQueryError /*|| process.env.LOGGER_CLI_SCHEMA_SYNC*/)
            this.log("error", "error during executing query:" + error);
    }
    /**
     * Logs events from the schema build process.
     */
    logSchemaBuild(message) {
        if (this.options.logSchemaCreation /*|| process.env.LOGGER_CLI_SCHEMA_SYNC*/)
            this.log("info", message);
    }
    /**
     * Perform logging using given logger, or by default to the console.
     * Log has its own level and message.
     */
    log(level, message) {
        if (!this.options)
            return;
        if (this.options.logger) {
            this.options.logger(level, message);
        }
        else {
            switch (level) {
                case "log":
                    console.log(message);
                    break;
                case "info":
                    console.info(message);
                    break;
                case "warn":
                    console.warn(message);
                    break;
                case "error":
                    console.error(message);
                    break;
            }
        }
    }
}
//# sourceMappingURL=Logger.js.map