import { QueryRunner } from "../../query-runner/QueryRunner";
import { ObjectLiteral } from "../../common/ObjectLiteral";
import { Logger } from "../../logger/Logger";
import { DatabaseConnection } from "../DatabaseConnection";
import { WebSqlDriver } from "./WebSqlDriver";
import { ColumnSchema } from "../../schema-builder/schema/ColumnSchema";
import { ColumnMetadata } from "../../metadata/ColumnMetadata";
import { TableSchema } from "../../schema-builder/schema/TableSchema";
import { IndexSchema } from "../../schema-builder/schema/IndexSchema";
import { ForeignKeySchema } from "../../schema-builder/schema/ForeignKeySchema";
import { NamingStrategyInterface } from "../../naming-strategy/NamingStrategyInterface";
/**
 * Runs queries on a single websql database connection.
 *
 * Does not support compose primary keys with autoincrement field.
 * todo: need to throw exception for this case.
 */
export declare class WebSqlQueryRunner implements QueryRunner {
    protected databaseConnection: DatabaseConnection;
    protected driver: WebSqlDriver;
    protected logger: Logger;
    /**
     * Indicates if connection for this query runner is released.
     * Once its released, query runner cannot run queries anymore.
     */
    protected isReleased: boolean;
    constructor(databaseConnection: DatabaseConnection, driver: WebSqlDriver, logger: Logger);
    /**
     * Releases database connection. This is needed when using connection pooling.
     * If connection is not from a pool, it should not be released.
     */
    release(): Promise<void>;
    /**
     * Removes all tables from the currently connected database.
     */
    clearDatabase(): Promise<void>;
    /**
     * Starts transaction.
     */
    beginTransaction(): Promise<void>;
    /**
     * Commits transaction.
     */
    commitTransaction(): Promise<void>;
    /**
     * Rollbacks transaction.
     */
    rollbackTransaction(): Promise<void>;
    /**
     * Checks if transaction is in progress.
     */
    isTransactionActive(): boolean;
    /**
     * Executes a given SQL query.
     */
    query(query: string, parameters?: any[]): Promise<any>;
    /**
     * Insert a new row into given table.
     */
    insert(tableName: string, keyValues: ObjectLiteral, generatedColumn?: ColumnMetadata): Promise<any>;
    /**
     * Updates rows that match given conditions in the given table.
     */
    update(tableName: string, valuesMap: ObjectLiteral, conditions: ObjectLiteral): Promise<void>;
    /**
     * Deletes from the given table by a given conditions.
     */
    delete(tableName: string, conditions: ObjectLiteral): Promise<void>;
    /**
     * Inserts rows into closure table.
     */
    insertIntoClosureTable(tableName: string, newEntityId: any, parentId: any, hasLevel: boolean): Promise<number>;
    /**
     * Loads all tables (with given names) from the database and creates a TableSchema from them.
     */
    loadSchemaTables(tableNames: string[], namingStrategy: NamingStrategyInterface): Promise<TableSchema[]>;
    /**
     * Creates a new table from the given table metadata and column metadatas.
     */
    createTable(table: TableSchema): Promise<void>;
    /**
     * Creates a new column from the column metadata in the table.
     */
    createColumns(tableSchema: TableSchema, columns: ColumnSchema[]): Promise<void>;
    /**
     * Changes a column in the table.
     * Changed column looses all its keys in the db.
     */
    changeColumns(tableSchema: TableSchema, changedColumns: {
        newColumn: ColumnSchema;
        oldColumn: ColumnSchema;
    }[]): Promise<void>;
    /**
     * Drops the columns in the table.
     */
    dropColumns(tableSchema: TableSchema, columns: ColumnSchema[]): Promise<void>;
    /**
     * Updates table's primary keys.
     */
    updatePrimaryKeys(dbTable: TableSchema): Promise<void>;
    /**
     * Creates a new foreign keys.
     */
    createForeignKeys(tableSchema: TableSchema, foreignKeys: ForeignKeySchema[]): Promise<void>;
    /**
     * Drops a foreign keys from the table.
     */
    dropForeignKeys(tableSchema: TableSchema, foreignKeys: ForeignKeySchema[]): Promise<void>;
    /**
     * Creates a new index.
     */
    createIndex(index: IndexSchema): Promise<void>;
    /**
     * Drops an index from the table.
     */
    dropIndex(tableName: string, indexName: string, isGenerated?: boolean): Promise<void>;
    /**
     * Creates a database type from a given column metadata.
     */
    normalizeType(column: ColumnMetadata): string;
    /**
     * Parametrizes given object of values. Used to create column=value queries.
     */
    protected parametrize(objectLiteral: ObjectLiteral, startIndex?: number): string[];
    /**
     * Builds a query for create column.
     */
    protected buildCreateColumnSql(column: ColumnSchema): string;
    protected recreateTable(tableSchema: TableSchema): Promise<void>;
}
