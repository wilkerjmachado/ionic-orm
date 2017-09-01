/**
 * Table's column's schema in the database represented in this class.
 */
export class ColumnSchema {
    constructor() {
        // -------------------------------------------------------------------------
        // Public Properties
        // -------------------------------------------------------------------------
        /**
         * Indicates if column is NULL, or is NOT NULL in the database.
         */
        this.isNullable = false;
        /**
         * Indicates if column is auto-generated sequence.
         */
        this.isGenerated = false;
        /**
         * Indicates if column is a primary key.
         */
        this.isPrimary = false;
        /**
         * Indicates if column has unique value.
         */
        this.isUnique = false;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Clones this column schema to a new column schema with exact same properties as this column schema has.
     */
    clone() {
        const newColumnSchema = new ColumnSchema();
        newColumnSchema.name = this.name;
        newColumnSchema.type = this.type;
        newColumnSchema.default = this.default;
        newColumnSchema.isNullable = this.isNullable;
        newColumnSchema.isGenerated = this.isGenerated;
        newColumnSchema.isPrimary = this.isPrimary;
        newColumnSchema.isUnique = this.isUnique;
        newColumnSchema.comment = this.comment;
        return newColumnSchema;
    }
    // -------------------------------------------------------------------------
    // Static Methods
    // -------------------------------------------------------------------------
    /**
     * Creates a new column based on the given column metadata.
     */
    static create(columnMetadata, normalizedType) {
        const columnSchema = new ColumnSchema();
        columnSchema.name = columnMetadata.name;
        columnSchema.default = columnMetadata.default;
        columnSchema.comment = columnMetadata.comment;
        columnSchema.isGenerated = columnMetadata.isGenerated;
        columnSchema.isNullable = columnMetadata.isNullable;
        columnSchema.type = normalizedType;
        columnSchema.isPrimary = columnMetadata.isPrimary;
        columnSchema.isUnique = columnMetadata.isUnique;
        return columnSchema;
    }
}
//# sourceMappingURL=ColumnSchema.js.map