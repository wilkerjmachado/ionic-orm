/**
 * Table schema in the database represented in this class.
 */
export class TableSchema {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(name, columns, justCreated) {
        /**
         * Table columns.
         */
        this.columns = [];
        /**
         * Table indices.
         */
        this.indices = [];
        /**
         * Table foreign keys.
         */
        this.foreignKeys = [];
        /**
         * Table primary keys.
         */
        this.primaryKeys = [];
        /**
         * Indicates if table schema was just created.
         * This is needed, for example to check if we need to skip primary keys creation
         * for new table schemas.
         */
        this.justCreated = false;
        this.name = name;
        if (columns)
            this.columns = columns;
        if (justCreated !== undefined)
            this.justCreated = justCreated;
    }
    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------
    /**
     * Gets only those primary keys that does not
     */
    get primaryKeysWithoutGenerated() {
        const generatedColumn = this.columns.find(column => column.isGenerated);
        if (!generatedColumn)
            return this.primaryKeys;
        return this.primaryKeys.filter(primaryKey => {
            return primaryKey.columnName !== generatedColumn.name;
        });
    }
    get hasGeneratedColumn() {
        return !!this.columns.find(column => column.isGenerated);
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Clones this table schema to a new table schema with all properties cloned.
     */
    clone() {
        const cloned = new TableSchema(this.name);
        cloned.columns = this.columns.map(column => column.clone());
        cloned.indices = this.indices.map(index => index.clone());
        cloned.foreignKeys = this.foreignKeys.map(key => key.clone());
        cloned.primaryKeys = this.primaryKeys.map(key => key.clone());
        return cloned;
    }
    /**
     * Adds column schemas.
     */
    addColumns(columns) {
        this.columns = this.columns.concat(columns);
    }
    /**
     * Replaces given column.
     */
    replaceColumn(oldColumn, newColumn) {
        this.columns[this.columns.indexOf(oldColumn)] = newColumn;
    }
    /**
     * Removes a column schema from this table schema.
     */
    removeColumn(columnToRemove) {
        const foundColumn = this.columns.find(column => column.name === columnToRemove.name);
        if (foundColumn)
            this.columns.splice(this.columns.indexOf(foundColumn), 1);
    }
    /**
     * Remove all column schemas from this table schema.
     */
    removeColumns(columns) {
        columns.forEach(column => this.removeColumn(column));
    }
    /**
     * Adds all given primary keys.
     */
    addPrimaryKeys(addedKeys) {
        addedKeys.forEach(key => this.primaryKeys.push(key));
    }
    /**
     * Removes all given primary keys.
     */
    removePrimaryKeys(droppedKeys) {
        droppedKeys.forEach(key => {
            this.primaryKeys.splice(this.primaryKeys.indexOf(key), 1);
        });
    }
    /**
     * Removes primary keys of the given columns.
     */
    removePrimaryKeysOfColumns(columns) {
        this.primaryKeys = this.primaryKeys.filter(primaryKey => {
            return !columns.find(column => column.name === primaryKey.columnName);
        });
    }
    /**
     * Adds foreign key schemas.
     */
    addForeignKeys(foreignKeys) {
        this.foreignKeys = this.foreignKeys.concat(foreignKeys);
    }
    /**
     * Removes foreign key from this table schema.
     */
    removeForeignKey(foreignKey) {
        const index = this.foreignKeys.indexOf(foreignKey);
        if (index !== -1)
            this.foreignKeys.splice(index, 1);
    }
    /**
     * Removes all foreign keys from this table schema.
     */
    removeForeignKeys(dbForeignKeys) {
        dbForeignKeys.forEach(foreignKey => this.removeForeignKey(foreignKey));
    }
    /**
     * Removes index schema from this table schema.
     */
    removeIndex(indexSchema) {
        const index = this.indices.indexOf(indexSchema);
        if (index !== -1)
            this.indices.splice(index, 1);
    }
    /**
     * Differentiate columns of this table schema and columns from the given column metadatas columns
     * and returns only changed.
     */
    findChangedColumns(queryRunner, columnMetadatas) {
        return this.columns.filter(columnSchema => {
            const columnMetadata = columnMetadatas.find(columnMetadata => columnMetadata.name === columnSchema.name);
            if (!columnMetadata)
                return false; // we don't need new columns, we only need exist and changed
            return columnSchema.name !== columnMetadata.name ||
                columnSchema.type !== queryRunner.normalizeType(columnMetadata) ||
                columnSchema.comment !== columnMetadata.comment ||
                (!columnSchema.isGenerated && columnSchema.default !== columnMetadata.default) || // we included check for generated here, because generated columns already can have default values
                columnSchema.isNullable !== columnMetadata.isNullable ||
                columnSchema.isUnique !== columnMetadata.isUnique ||
                // columnSchema.isPrimary !== columnMetadata.isPrimary ||
                columnSchema.isGenerated !== columnMetadata.isGenerated;
        });
    }
}
//# sourceMappingURL=TableSchema.js.map