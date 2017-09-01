/**
 * Contains all information about entity's embedded property.
 */
export class EmbeddedMetadata {
    // ---------------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------------
    constructor(type, propertyName, table, columns) {
        this.type = type;
        this.propertyName = propertyName;
        this.table = table;
        this.columns = columns;
        this.columns.forEach(column => {
            column.embeddedMetadata = this;
        });
    }
    // ---------------------------------------------------------------------
    // Public Methods
    // ---------------------------------------------------------------------
    /**
     * Creates a new embedded object.
     */
    create() {
        return new this.type;
    }
}
//# sourceMappingURL=EmbeddedMetadata.js.map