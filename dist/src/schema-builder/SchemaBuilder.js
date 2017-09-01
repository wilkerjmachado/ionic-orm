var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TableSchema } from "./schema/TableSchema";
import { ColumnSchema } from "./schema/ColumnSchema";
import { ForeignKeySchema } from "./schema/ForeignKeySchema";
import { IndexSchema } from "./schema/IndexSchema";
import { PrimaryKeySchema } from "./schema/PrimaryKeySchema";
/**
 * Creates complete tables schemas in the database based on the entity metadatas.
 *
 * Steps how schema is being built:
 * 1. load list of all tables with complete column and keys information from the db
 * 2. drop all (old) foreign keys that exist in the table, but does not exist in the metadata
 * 3. create new tables that does not exist in the db, but exist in the metadata
 * 4. drop all columns exist (left old) in the db table, but does not exist in the metadata
 * 5. add columns from metadata which does not exist in the table
 * 6. update all exist columns which metadata has changed
 * 7. update primary keys - update old and create new primary key from changed columns
 * 8. create foreign keys which does not exist in the table yet
 * 9. create indices which are missing in db yet, and drops indices which exist in the db, but does not exist in the metadata anymore
 */
export class SchemaBuilder {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    /**
     * @param driver Driver needs to create a query runner
     * @param logger Used to log schema creation events
     * @param entityMetadatas All entities to create schema for
     * @param namingStrategy Naming strategy used to generate special names
     */
    constructor(driver, logger, entityMetadatas, namingStrategy) {
        this.driver = driver;
        this.logger = logger;
        this.entityMetadatas = entityMetadatas;
        this.namingStrategy = namingStrategy;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Creates complete schemas for the given entity metadatas.
     */
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            this.queryRunner = yield this.driver.createQueryRunner();
            this.tableSchemas = yield this.loadTableSchemas();
            yield this.queryRunner.beginTransaction();
            try {
                yield this.dropOldForeignKeys();
                // await this.dropOldPrimaryKeys(); // todo: need to drop primary column because column updates are not possible
                yield this.createNewTables();
                yield this.dropRemovedColumns();
                yield this.addNewColumns();
                yield this.updateExistColumns();
                yield this.updatePrimaryKeys();
                yield this.createForeignKeys();
                yield this.createIndices();
                yield this.queryRunner.commitTransaction();
            }
            catch (error) {
                yield this.queryRunner.rollbackTransaction();
                throw error;
            }
            finally {
                yield this.queryRunner.release();
            }
        });
    }
    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------
    get entityToSyncMetadatas() {
        return this.entityMetadatas.filter(metadata => !metadata.table.skipSchemaSync);
    }
    /**
     * Loads all table schemas from the database.
     */
    loadTableSchemas() {
        const tableNames = this.entityToSyncMetadatas.map(metadata => metadata.table.name);
        return this.queryRunner.loadSchemaTables(tableNames, this.namingStrategy);
    }
    /**
     * Drops all (old) foreign keys that exist in the table schemas, but do not exist in the entity metadata.
     */
    dropOldForeignKeys() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(this.entityToSyncMetadatas.map((metadata) => __awaiter(this, void 0, void 0, function* () {
                const tableSchema = this.tableSchemas.find(table => table.name === metadata.table.name);
                if (!tableSchema)
                    return;
                // find foreign keys that exist in the schemas but does not exist in the entity metadata
                const foreignKeySchemasToDrop = tableSchema.foreignKeys.filter(foreignKeySchema => {
                    return !metadata.foreignKeys.find(metadataForeignKey => metadataForeignKey.name === foreignKeySchema.name);
                });
                if (foreignKeySchemasToDrop.length === 0)
                    return;
                this.logger.logSchemaBuild(`dropping old foreign keys of ${tableSchema.name}: ${foreignKeySchemasToDrop.map(dbForeignKey => dbForeignKey.name).join(", ")}`);
                // remove foreign keys from the table schema
                tableSchema.removeForeignKeys(foreignKeySchemasToDrop);
                // drop foreign keys from the database
                yield this.queryRunner.dropForeignKeys(tableSchema, foreignKeySchemasToDrop);
            })));
        });
    }
    /**
     * Creates tables that do not exist in the database yet.
     * New tables are created without foreign and primary keys.
     * Primary key only can be created in conclusion with auto generated column.
     */
    createNewTables() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(this.entityToSyncMetadatas.map((metadata) => __awaiter(this, void 0, void 0, function* () {
                // check if table does not exist yet
                const existTableSchema = this.tableSchemas.find(table => table.name === metadata.table.name);
                if (existTableSchema)
                    return;
                this.logger.logSchemaBuild(`creating a new table: ${metadata.table.name}`);
                // create a new table schema and sync it in the database
                const tableSchema = new TableSchema(metadata.table.name, this.metadataColumnsToColumnSchemas(metadata.columns), true);
                this.tableSchemas.push(tableSchema);
                yield this.queryRunner.createTable(tableSchema);
            })));
        });
    }
    /**
     * Drops all columns that exist in the table, but does not exist in the metadata (left old).
     * We drop their keys too, since it should be safe.
     */
    dropRemovedColumns() {
        return Promise.all(this.entityToSyncMetadatas.map((metadata) => __awaiter(this, void 0, void 0, function* () {
            const tableSchema = this.tableSchemas.find(table => table.name === metadata.table.name);
            if (!tableSchema)
                return;
            // find columns that exist in the database but does not exist in the metadata
            const droppedColumnSchemas = tableSchema.columns.filter(columnSchema => {
                return !metadata.columns.find(columnMetadata => columnMetadata.name === columnSchema.name);
            });
            if (droppedColumnSchemas.length === 0)
                return;
            // drop all foreign keys that has column to be removed in its columns
            yield Promise.all(droppedColumnSchemas.map(droppedColumnSchema => {
                return this.dropColumnReferencedForeignKeys(metadata.table.name, droppedColumnSchema.name);
            }));
            // drop all indices that point to this column
            yield Promise.all(droppedColumnSchemas.map(droppedColumnSchema => {
                return this.dropColumnReferencedIndices(metadata.table.name, droppedColumnSchema.name);
            }));
            this.logger.logSchemaBuild(`columns dropped in ${tableSchema.name}: ` + droppedColumnSchemas.map(column => column.name).join(", "));
            // remove columns from the table schema and primary keys of it if its used in the primary keys
            tableSchema.removeColumns(droppedColumnSchemas);
            tableSchema.removePrimaryKeysOfColumns(droppedColumnSchemas);
            // drop columns from the database
            yield this.queryRunner.dropColumns(tableSchema, droppedColumnSchemas);
        })));
    }
    /**
     * Adds columns from metadata which does not exist in the table.
     * Columns are created without keys.
     */
    addNewColumns() {
        return Promise.all(this.entityToSyncMetadatas.map((metadata) => __awaiter(this, void 0, void 0, function* () {
            const tableSchema = this.tableSchemas.find(table => table.name === metadata.table.name);
            if (!tableSchema)
                return;
            // find which columns are new
            const newColumnMetadatas = metadata.columns.filter(columnMetadata => {
                return !tableSchema.columns.find(columnSchema => columnSchema.name === columnMetadata.name);
            });
            if (newColumnMetadatas.length === 0)
                return;
            this.logger.logSchemaBuild(`new columns added: ` + newColumnMetadatas.map(column => column.name).join(", "));
            // create columns in the database
            const newColumnSchemas = this.metadataColumnsToColumnSchemas(newColumnMetadatas);
            tableSchema.addColumns(newColumnSchemas);
            yield this.queryRunner.createColumns(tableSchema, newColumnSchemas);
        })));
    }
    /**
     * Update all exist columns which metadata has changed.
     * Still don't create keys. Also we don't touch foreign keys of the changed columns.
     */
    updateExistColumns() {
        return Promise.all(this.entityToSyncMetadatas.map((metadata) => __awaiter(this, void 0, void 0, function* () {
            const tableSchema = this.tableSchemas.find(table => table.name === metadata.table.name);
            if (!tableSchema)
                return;
            const updatedColumnSchemas = tableSchema.findChangedColumns(this.queryRunner, metadata.columns);
            if (updatedColumnSchemas.length === 0)
                return;
            this.logger.logSchemaBuild(`columns changed in ${tableSchema.name}. updating: ` + updatedColumnSchemas.map(column => column.name).join(", "));
            // drop all foreign keys that point to this column
            const dropRelatedForeignKeysPromises = updatedColumnSchemas
                .filter(changedColumnSchema => !!metadata.columns.find(columnMetadata => columnMetadata.name === changedColumnSchema.name))
                .map(changedColumnSchema => this.dropColumnReferencedForeignKeys(metadata.table.name, changedColumnSchema.name));
            // wait until all related foreign keys are dropped
            yield Promise.all(dropRelatedForeignKeysPromises);
            // drop all indices that point to this column
            const dropRelatedIndicesPromises = updatedColumnSchemas
                .filter(changedColumnSchema => !!metadata.columns.find(columnMetadata => columnMetadata.name === changedColumnSchema.name))
                .map(changedColumnSchema => this.dropColumnReferencedIndices(metadata.table.name, changedColumnSchema.name));
            // wait until all related indices are dropped
            yield Promise.all(dropRelatedIndicesPromises);
            // generate a map of new/old columns
            const newAndOldColumnSchemas = updatedColumnSchemas.map(changedColumnSchema => {
                const columnMetadata = metadata.columns.find(column => column.name === changedColumnSchema.name);
                const newColumnSchema = ColumnSchema.create(columnMetadata, this.queryRunner.normalizeType(columnMetadata));
                tableSchema.replaceColumn(changedColumnSchema, newColumnSchema);
                return {
                    newColumn: newColumnSchema,
                    oldColumn: changedColumnSchema
                };
            });
            return this.queryRunner.changeColumns(tableSchema, newAndOldColumnSchemas);
        })));
    }
    /**
     * Creates primary keys which does not exist in the table yet.
     */
    updatePrimaryKeys() {
        return Promise.all(this.entityToSyncMetadatas.map((metadata) => __awaiter(this, void 0, void 0, function* () {
            const tableSchema = this.tableSchemas.find(table => table.name === metadata.table.name && !table.justCreated);
            if (!tableSchema)
                return;
            const metadataPrimaryColumns = metadata.columns.filter(column => column.isPrimary && !column.isGenerated);
            const addedKeys = metadataPrimaryColumns
                .filter(primaryKey => {
                return !tableSchema.primaryKeysWithoutGenerated.find(dbPrimaryKey => dbPrimaryKey.columnName === primaryKey.name);
            })
                .map(primaryKey => new PrimaryKeySchema("", primaryKey.name));
            const droppedKeys = tableSchema.primaryKeysWithoutGenerated.filter(primaryKeySchema => {
                return !metadataPrimaryColumns.find(primaryKeyMetadata => primaryKeyMetadata.name === primaryKeySchema.columnName);
            });
            if (addedKeys.length === 0 && droppedKeys.length === 0)
                return;
            this.logger.logSchemaBuild(`primary keys of ${tableSchema.name} has changed: dropped - ${droppedKeys.map(key => key.columnName).join(", ") || "nothing"}; added - ${addedKeys.map(key => key.columnName).join(", ") || "nothing"}`);
            tableSchema.addPrimaryKeys(addedKeys);
            tableSchema.removePrimaryKeys(droppedKeys);
            yield this.queryRunner.updatePrimaryKeys(tableSchema);
        })));
    }
    /**
     * Creates foreign keys which does not exist in the table yet.
     */
    createForeignKeys() {
        return Promise.all(this.entityToSyncMetadatas.map((metadata) => __awaiter(this, void 0, void 0, function* () {
            const tableSchema = this.tableSchemas.find(table => table.name === metadata.table.name);
            if (!tableSchema)
                return;
            const newKeys = metadata.foreignKeys.filter(foreignKey => {
                return !tableSchema.foreignKeys.find(dbForeignKey => dbForeignKey.name === foreignKey.name);
            });
            if (newKeys.length === 0)
                return;
            const dbForeignKeys = newKeys.map(foreignKeyMetadata => ForeignKeySchema.create(foreignKeyMetadata));
            this.logger.logSchemaBuild(`creating a foreign keys: ${newKeys.map(key => key.name).join(", ")}`);
            yield this.queryRunner.createForeignKeys(tableSchema, dbForeignKeys);
            tableSchema.addForeignKeys(dbForeignKeys);
        })));
    }
    /**
     * Creates indices which are missing in db yet, and drops indices which exist in the db,
     * but does not exist in the metadata anymore.
     */
    createIndices() {
        // return Promise.all(this.entityMetadatas.map(metadata => this.createIndices(metadata.table, metadata.indices)));
        return Promise.all(this.entityToSyncMetadatas.map((metadata) => __awaiter(this, void 0, void 0, function* () {
            const tableSchema = this.tableSchemas.find(table => table.name === metadata.table.name);
            if (!tableSchema)
                return;
            // drop all indices that exist in the table, but does not exist in the given composite indices
            const dropQueries = tableSchema.indices
                .filter(indexSchema => !metadata.indices.find(indexMetadata => indexMetadata.name === indexSchema.name))
                .map((indexSchema) => __awaiter(this, void 0, void 0, function* () {
                this.logger.logSchemaBuild(`dropping an index: ${indexSchema.name}`);
                tableSchema.removeIndex(indexSchema);
                yield this.queryRunner.dropIndex(metadata.table.name, indexSchema.name);
            }));
            // then create table indices for all composite indices we have
            const addQueries = metadata.indices
                .filter(indexMetadata => !tableSchema.indices.find(indexSchema => indexSchema.name === indexMetadata.name))
                .map((indexMetadata) => __awaiter(this, void 0, void 0, function* () {
                const indexSchema = IndexSchema.create(indexMetadata);
                tableSchema.indices.push(indexSchema);
                this.logger.logSchemaBuild(`adding new index: ${indexSchema.name}`);
                yield this.queryRunner.createIndex(indexSchema);
            }));
            yield Promise.all(dropQueries.concat(addQueries));
        })));
    }
    /**
     * Drops all indices where given column of the given table is being used.
     */
    dropColumnReferencedIndices(tableName, columnName) {
        return __awaiter(this, void 0, void 0, function* () {
            const allIndexMetadatas = this.entityMetadatas.reduce((all, metadata) => all.concat(metadata.indices), []);
            const tableSchema = this.tableSchemas.find(table => table.name === tableName);
            if (!tableSchema)
                return;
            // console.log(allIndexMetadatas);
            // find depend indices to drop them
            const dependIndices = allIndexMetadatas.filter(indexMetadata => {
                return indexMetadata.tableName === tableName && indexMetadata.columns.indexOf(columnName) !== -1;
            });
            if (!dependIndices.length)
                return;
            const dependIndicesInTable = tableSchema.indices.filter(indexSchema => {
                return !!dependIndices.find(indexMetadata => indexSchema.name === indexMetadata.name);
            });
            if (dependIndicesInTable.length === 0)
                return;
            this.logger.logSchemaBuild(`dropping related indices of ${tableName}#${columnName}: ${dependIndicesInTable.map(index => index.name).join(", ")}`);
            const dropPromises = dependIndicesInTable.map(index => {
                tableSchema.removeIndex(index);
                return this.queryRunner.dropIndex(tableSchema.name, index.name);
            });
            yield Promise.all(dropPromises);
        });
    }
    /**
     * Drops all foreign keys where given column of the given table is being used.
     */
    dropColumnReferencedForeignKeys(tableName, columnName) {
        return __awaiter(this, void 0, void 0, function* () {
            const allForeignKeyMetadatas = this.entityMetadatas.reduce((all, metadata) => all.concat(metadata.foreignKeys), []);
            const tableSchema = this.tableSchemas.find(table => table.name === tableName);
            if (!tableSchema)
                return;
            // find depend foreign keys to drop them
            const dependForeignKeys = allForeignKeyMetadatas.filter(foreignKey => {
                if (foreignKey.tableName === tableName) {
                    return !!foreignKey.columns.find(fkColumn => {
                        return fkColumn.name === columnName;
                    });
                }
                else if (foreignKey.referencedTableName === tableName) {
                    return !!foreignKey.referencedColumns.find(fkColumn => {
                        return fkColumn.name === columnName;
                    });
                }
                return false;
            });
            if (!dependForeignKeys.length)
                return;
            const dependForeignKeyInTable = dependForeignKeys.filter(fk => {
                return !!tableSchema.foreignKeys.find(dbForeignKey => dbForeignKey.name === fk.name);
            });
            if (dependForeignKeyInTable.length === 0)
                return;
            this.logger.logSchemaBuild(`dropping related foreign keys of ${tableName}#${columnName}: ${dependForeignKeyInTable.map(foreignKey => foreignKey.name).join(", ")}`);
            const foreignKeySchemas = dependForeignKeyInTable.map(foreignKeyMetadata => ForeignKeySchema.create(foreignKeyMetadata)); // todo: why created again, when exist in the tableSchema.foreignKeys ?!
            tableSchema.removeForeignKeys(foreignKeySchemas);
            yield this.queryRunner.dropForeignKeys(tableSchema, foreignKeySchemas);
        });
    }
    /**
     * Creates new column schemas from the given column metadatas.
     */
    metadataColumnsToColumnSchemas(columns) {
        return columns.map(columnMetadata => {
            return ColumnSchema.create(columnMetadata, this.queryRunner.normalizeType(columnMetadata));
        });
    }
}
//# sourceMappingURL=SchemaBuilder.js.map