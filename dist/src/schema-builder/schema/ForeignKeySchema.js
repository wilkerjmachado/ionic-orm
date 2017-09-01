/**
 * Foreign key from the database stored in this class.
 */
export class ForeignKeySchema {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(name, columnNames, referencedColumnNames, referencedTable, onDelete) {
        this.name = name;
        this.columnNames = columnNames;
        this.referencedColumnNames = referencedColumnNames;
        this.referencedTableName = referencedTable;
        this.onDelete = onDelete;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Creates a new copy of this foreign key with exactly same properties.
     */
    clone() {
        return new ForeignKeySchema(this.name, this.columnNames, this.referencedColumnNames, this.referencedTableName);
    }
    // -------------------------------------------------------------------------
    // Static Methods
    // -------------------------------------------------------------------------
    /**
     * Creates a new foreign schema from the given foreign key metadata.
     */
    static create(metadata) {
        return new ForeignKeySchema(metadata.name, metadata.columnNames, metadata.referencedColumnNames, metadata.referencedTableName, metadata.onDelete);
    }
}
//# sourceMappingURL=ForeignKeySchema.js.map