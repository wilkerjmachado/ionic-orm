export class ColumnTypeUndefinedError extends Error {
    constructor(object, propertyName) {
        super();
        this.name = "ColumnTypeUndefinedError";
        this.message = `Column type for ${object.constructor.name}#${propertyName} is not defined or cannot be guessed. ` +
            `Try to implicitly provide a column type to @Column decorator.`;
    }
}
//# sourceMappingURL=ColumnTypeUndefinedError.js.map