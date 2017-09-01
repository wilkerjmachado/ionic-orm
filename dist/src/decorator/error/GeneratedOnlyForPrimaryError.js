export class GeneratedOnlyForPrimaryError extends Error {
    constructor(object, propertyName) {
        super();
        this.name = "GeneratedOnlyForPrimaryError";
        this.message = `Column for property ${object.constructor.name}#${propertyName} cannot have a generated ` +
            `value because its not a primary column. Try to use @PrimaryColumn decorator.`;
    }
}
//# sourceMappingURL=GeneratedOnlyForPrimaryError.js.map