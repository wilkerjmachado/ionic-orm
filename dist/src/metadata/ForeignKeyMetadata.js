/**
 * Contains all information about entity's foreign key.
 */
export class ForeignKeyMetadata {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(columns, referencedTable, referencedColumns, onDelete) {
        this.columns = columns;
        this.referencedTable = referencedTable;
        this.referencedColumns = referencedColumns;
        if (onDelete)
            this.onDelete = onDelete;
    }
    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------
    /**
     * Gets the table name to which this foreign key is applied.
     */
    get tableName() {
        return this.entityMetadata.table.name;
    }
    /**
     * Gets the table name to which this foreign key is referenced.
     */
    get referencedTableName() {
        return this.referencedTable.name;
    }
    /**
     * Gets foreign key name.
     */
    get name() {
        return this.entityMetadata.namingStrategy.foreignKeyName(this.tableName, this.columnNames, this.referencedTable.name, this.referencedColumnNames);
    }
    /**
     * Gets array of column names.
     */
    get columnNames() {
        return this.columns.map(column => column.name);
    }
    /**
     * Gets array of referenced column names.
     */
    get referencedColumnNames() {
        return this.referencedColumns.map(column => column.name);
    }
}
//# sourceMappingURL=ForeignKeyMetadata.js.map