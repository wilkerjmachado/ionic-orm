import { Driver } from "../Driver";
import { DriverOptions } from "../DriverOptions";
import { ObjectLiteral } from "../../common/ObjectLiteral";
import { DatabaseConnection } from "../DatabaseConnection";
import { ColumnType } from "../../metadata/types/ColumnTypes";
import { ColumnMetadata } from "../../metadata/ColumnMetadata";
import { Logger } from "../../logger/Logger";
import { QueryRunner } from "../../query-runner/QueryRunner";
/**
 * Organizes communication with websql DBMS.
 */
export declare class WebSqlDriver implements Driver {
    /**
     * Driver connection options.
     */
    readonly options: DriverOptions;
    /**
     * SQLite library.
     */
    protected websql: any;
    /**
     * Connection to SQLite database.
     */
    protected databaseConnection: DatabaseConnection | undefined;
    /**
     * Logger used go log queries and errors.
     */
    protected logger: Logger;
    constructor(connectionOptions: DriverOptions, logger: Logger, websql?: any);
    /**
     * Performs connection to the database.
     */
    connect(): Promise<void>;
    /**
     * Closes connection with database.
     */
    disconnect(): Promise<void>;
    /**
     * Creates a query runner used for common queries.
     */
    createQueryRunner(): Promise<QueryRunner>;
    /**
     * Access to the native implementation of the database.
     */
    nativeInterface(): {
        driver: any;
        connection: any;
    };
    /**
     * Prepares given value to a value to be persisted, based on its column type and metadata.
     */
    preparePersistentValue(value: any, column: ColumnMetadata): any;
    /**
     * Prepares given value to a value to be persisted, based on its column metadata.
     */
    prepareHydratedValue(value: any, type: ColumnType): any;
    /**
     * Prepares given value to a value to be persisted, based on its column type.
     */
    prepareHydratedValue(value: any, column: ColumnMetadata): any;
    /**
     * Replaces parameters in the given sql with special escaping character
     * and an array of parameter names to be passed to a query.
     */
    escapeQueryWithParameters(sql: string, parameters: ObjectLiteral): [string, any[]];
    /**
     * Prepares given parameter
     */
    prepareParameter(param: any): any;
    /**
     * Escapes a column name.
     */
    escapeColumnName(columnName: string): string;
    /**
     * Escapes an alias.
     */
    escapeAliasName(aliasName: string): string;
    /**
     * Escapes a table name.
     */
    escapeTableName(tableName: string): string;
    /**
     * Retrieves a new database connection.
     * If pooling is enabled then connection from the pool will be retrieved.
     * Otherwise active connection will be returned.
     */
    protected retrieveDatabaseConnection(): Promise<DatabaseConnection>;
    /**
     * If driver dependency is not given explicitly, then try to load it via "require".
     */
    protected loadDependencies(): void;
}
