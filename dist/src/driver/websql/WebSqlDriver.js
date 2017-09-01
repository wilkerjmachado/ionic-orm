var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const win = window;
import { ConnectionIsNotSetError } from "../error/ConnectionIsNotSetError";
import { DriverPackageNotInstalledError } from "../error/DriverPackageNotInstalledError";
import { ColumnTypes } from "../../metadata/types/ColumnTypes";
import { ColumnMetadata } from "../../metadata/ColumnMetadata";
import moment from 'moment';
import { WebSqlQueryRunner } from "./WebSqlQueryRunner";
/**
 * Organizes communication with websql DBMS.
 */
export class WebSqlDriver {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(connectionOptions, logger, websql) {
        this.options = connectionOptions;
        this.logger = logger;
        this.websql = websql;
        // validate options to make sure everything is set
        // if (!this.options.storage)
        //     throw new DriverOptionNotSetError("storage");
        // if websql package instance was not set explicitly then try to load it
        if (!websql)
            this.loadDependencies();
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Performs connection to the database.
     */
    connect() {
        return new Promise((ok, fail) => {
            const connection = win.openDatabase(this.options.database, '1.0', this.options.database, 5 * 1024 * 1024);
            if (!connection)
                return fail();
            this.databaseConnection = {
                id: 1,
                connection: connection,
                isTransactionActive: false
            };
            ok();
        });
    }
    /**
     * Closes connection with database.
     */
    disconnect() {
        return new Promise((ok, fail) => {
            const handler = (err) => err ? fail(err) : ok();
            if (!this.databaseConnection)
                return fail(new ConnectionIsNotSetError("websql"));
            this.databaseConnection.connection.close(handler);
        });
    }
    /**
     * Creates a query runner used for common queries.
     */
    createQueryRunner() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.databaseConnection)
                return Promise.reject(new ConnectionIsNotSetError("websql"));
            const databaseConnection = yield this.retrieveDatabaseConnection();
            return new WebSqlQueryRunner(databaseConnection, this, this.logger);
        });
    }
    /**
     * Access to the native implementation of the database.
     */
    nativeInterface() {
        return {
            driver: this.websql,
            connection: this.databaseConnection ? this.databaseConnection.connection : undefined
        };
    }
    /**
     * Prepares given value to a value to be persisted, based on its column type and metadata.
     */
    preparePersistentValue(value, column) {
        switch (column.type) {
            case ColumnTypes.BOOLEAN:
                return value === true ? 1 : 0;
            case ColumnTypes.DATE:
                return moment(value).format("YYYY-MM-DD");
            case ColumnTypes.TIME:
                return moment(value).format("HH:mm:ss");
            case ColumnTypes.DATETIME:
                return moment(value).format("YYYY-MM-DD HH:mm:ss");
            case ColumnTypes.JSON:
                return JSON.stringify(value);
            case ColumnTypes.SIMPLE_ARRAY:
                return value
                    .map(i => String(i))
                    .join(",");
        }
        return value;
    }
    /**
     * Prepares given value to a value to be persisted, based on its column type or metadata.
     */
    prepareHydratedValue(value, columnOrColumnType) {
        const type = columnOrColumnType instanceof ColumnMetadata ? columnOrColumnType.type : columnOrColumnType;
        switch (type) {
            case ColumnTypes.BOOLEAN:
                return value ? true : false;
            case ColumnTypes.DATE:
                if (value instanceof Date)
                    return value;
                return moment(value, "YYYY-MM-DD").toDate();
            case ColumnTypes.TIME:
                return moment(value, "HH:mm:ss").toDate();
            case ColumnTypes.DATETIME:
                if (value instanceof Date)
                    return value;
                return moment(value, "YYYY-MM-DD HH:mm:ss").toDate();
            case ColumnTypes.JSON:
                return JSON.parse(value);
            case ColumnTypes.SIMPLE_ARRAY:
                return value.split(",");
        }
        return value;
    }
    /**
     * Replaces parameters in the given sql with special escaping character
     * and an array of parameter names to be passed to a query.
     */
    escapeQueryWithParameters(sql, parameters) {
        if (!parameters || !Object.keys(parameters).length)
            return [sql, []];
        const builtParameters = [];
        const keys = Object.keys(parameters).map(parameter => "(:" + parameter + "\\b)").join("|");
        sql = sql.replace(new RegExp(keys, "g"), (key) => {
            const value = parameters[key.substr(1)];
            if (value instanceof Array) {
                return value.map((v) => {
                    builtParameters.push(this.prepareParameter(v));
                    return "?"; // + builtParameters.length;
                }).join(", ");
            }
            else {
                builtParameters.push(this.prepareParameter(value));
            }
            return "?"; // + builtParameters.length;
        }); // todo: make replace only in value statements, otherwise problems
        return [sql, builtParameters];
    }
    /**
     * Prepares given parameter
     */
    prepareParameter(param) {
        switch (typeof (param)) {
            case "boolean":
                return param === true ? 1 : 0;
            default:
                return param;
        }
    }
    /**
     * Escapes a column name.
     */
    escapeColumnName(columnName) {
        return "\"" + columnName + "\"";
    }
    /**
     * Escapes an alias.
     */
    escapeAliasName(aliasName) {
        return "\"" + aliasName + "\"";
    }
    /**
     * Escapes a table name.
     */
    escapeTableName(tableName) {
        return "\"" + tableName + "\"";
    }
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Retrieves a new database connection.
     * If pooling is enabled then connection from the pool will be retrieved.
     * Otherwise active connection will be returned.
     */
    retrieveDatabaseConnection() {
        if (this.databaseConnection)
            return Promise.resolve(this.databaseConnection);
        throw new ConnectionIsNotSetError("websql");
    }
    /**
     * If driver dependency is not given explicitly, then try to load it via "require".
     */
    loadDependencies() {
        // if (!require)
        //     throw new DriverPackageLoadError();
        if (!win.openDatabase) {
            throw new DriverPackageNotInstalledError("WebSQL", "websql");
        }
    }
}
//# sourceMappingURL=WebSqlDriver.js.map