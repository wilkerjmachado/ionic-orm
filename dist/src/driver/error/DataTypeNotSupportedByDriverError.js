/**
 * Thrown if some data type is not supported by a driver.
 */
export class DataTypeNotSupportedByDriverError extends Error {
    constructor(dataType, driverName) {
        super();
        this.name = "DataTypeNotSupportedByDriverError";
        this.message = `Specified type (${dataType}) is not supported by ${driverName} driver.`;
    }
}
//# sourceMappingURL=DataTypeNotSupportedByDriverError.js.map