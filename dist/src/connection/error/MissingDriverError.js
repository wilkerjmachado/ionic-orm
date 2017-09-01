/**
 * Thrown when consumer specifies driver type that does not exist or supported.
 */
export class MissingDriverError extends Error {
    constructor(driverType) {
        super();
        this.name = "MissingDriverError";
        this.message = `Wrong driver ${driverType} given. Supported drivers are: "mysql", "mysql2", "postgres", "mssql", "oracle", "mariadb", "sqlite".`;
        this.stack = new Error().stack;
    }
}
//# sourceMappingURL=MissingDriverError.js.map