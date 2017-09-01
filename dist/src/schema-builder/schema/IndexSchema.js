/**
 * Database's table index stored in this class.
 */
export class IndexSchema {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(tableName, name, columnNames, isUnique) {
        this.tableName = tableName;
        this.name = name;
        this.columnNames = columnNames;
        this.isUnique = isUnique;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Creates a new copy of this index with exactly same properties.
     */
    clone() {
        return new IndexSchema(this.tableName, this.name, this.columnNames.map(name => name), this.isUnique);
    }
    // -------------------------------------------------------------------------
    // Static Methods
    // -------------------------------------------------------------------------
    /**
     * Creates index from the index metadata object.
     */
    static create(indexMetadata) {
        return new IndexSchema(indexMetadata.entityMetadata.table.name, indexMetadata.name, indexMetadata.columns, indexMetadata.isUnique);
    }
}
//# sourceMappingURL=IndexSchema.js.map