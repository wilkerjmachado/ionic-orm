/**
 * Thrown if database driver does not support pooling.
 */
export class DriverPoolingNotSupportedError extends Error {
    constructor(driverName) {
        super();
        this.name = "DriverPoolingNotSupportedError";
        this.message = `Connection pooling is not supported by (${driverName}) driver.`;
    }
}
//# sourceMappingURL=DriverPoolingNotSupportedError.js.map