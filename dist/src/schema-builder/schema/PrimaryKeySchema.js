/**
 * Primary key from the database stored in this class.
 */
export class PrimaryKeySchema {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(name, columnName) {
        this.name = name;
        this.columnName = columnName;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Creates a new copy of this primary key with exactly same properties.
     */
    clone() {
        return new PrimaryKeySchema(this.name, this.columnName);
    }
}
//# sourceMappingURL=PrimaryKeySchema.js.map