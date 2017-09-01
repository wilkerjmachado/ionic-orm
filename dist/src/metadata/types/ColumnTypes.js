/**
 * All data types that column can be.
 */
export class ColumnTypes {
    /**
     * Checks if given type in a string format is supported by ORM.
     */
    static isTypeSupported(type) {
        return this.supportedTypes.indexOf(type) !== -1;
    }
    /**
     * Returns list of all supported types by the ORM.
     */
    static get supportedTypes() {
        return [
            this.STRING,
            this.TEXT,
            this.NUMBER,
            this.INTEGER,
            this.INT,
            this.SMALLINT,
            this.BIGINT,
            this.FLOAT,
            this.DOUBLE,
            this.DECIMAL,
            this.DATE,
            this.TIME,
            this.DATETIME,
            this.BOOLEAN,
            this.JSON,
            this.SIMPLE_ARRAY
        ];
    }
    /**
     * Tries to guess a column type from the given function.
     */
    static determineTypeFromFunction(type) {
        if (type instanceof Date) {
            return ColumnTypes.DATETIME;
        }
        else if (type instanceof Function) {
            const typeName = type.name.toLowerCase();
            switch (typeName) {
                case "number":
                    return ColumnTypes.NUMBER;
                case "boolean":
                    return ColumnTypes.BOOLEAN;
                case "string":
                    return ColumnTypes.STRING;
                case "date":
                    return ColumnTypes.DATETIME;
                case "object":
                    return ColumnTypes.JSON;
            }
        }
        else if (type instanceof Object) {
            return ColumnTypes.JSON;
        }
        throw new Error(`Column type of ${type} cannot be determined.`);
        // return undefined;
    }
    static typeToString(type) {
        return type.name.toLowerCase();
    }
    /**
     * Checks if column type is numeric.
     */
    static isNumeric(type) {
        return type === ColumnTypes.NUMBER ||
            type === ColumnTypes.INT ||
            type === ColumnTypes.INTEGER ||
            type === ColumnTypes.BIGINT ||
            type === ColumnTypes.SMALLINT ||
            type === ColumnTypes.DOUBLE ||
            type === ColumnTypes.FLOAT;
    }
}
/**
 * SQL VARCHAR type. Your class's property type should be a "string".
 */
ColumnTypes.STRING = "string";
/**
 * SQL CLOB type. Your class's property type should be a "string".
 */
ColumnTypes.TEXT = "text";
/**
 * SQL FLOAT type. Your class's property type should be a "number".
 */
ColumnTypes.NUMBER = "number";
/**
 * SQL INT type. Your class's property type should be a "number".
 */
ColumnTypes.INTEGER = "integer";
/**
 * SQL INT type. Your class's property type should be a "number".
 */
ColumnTypes.INT = "int";
/**
 * SQL SMALLINT type. Your class's property type should be a "number".
 */
ColumnTypes.SMALLINT = "smallint";
/**
 * SQL BIGINT type. Your class's property type should be a "number".
 */
ColumnTypes.BIGINT = "bigint";
/**
 * SQL FLOAT type. Your class's property type should be a "number".
 */
ColumnTypes.FLOAT = "float";
/**
 * SQL FLOAT type. Your class's property type should be a "number".
 */
ColumnTypes.DOUBLE = "double";
/**
 * SQL DECIMAL type. Your class's property type should be a "string".
 */
ColumnTypes.DECIMAL = "decimal";
/**
 * SQL DATETIME type. Your class's property type should be a "Date" object.
 */
ColumnTypes.DATE = "date";
/**
 * SQL TIME type. Your class's property type should be a "Date" object.
 */
ColumnTypes.TIME = "time";
/**
 * SQL DATETIME/TIMESTAMP type. Your class's property type should be a "Date" object.
 */
ColumnTypes.DATETIME = "datetime";
/**
 * SQL BOOLEAN type. Your class's property type should be a "boolean".
 */
ColumnTypes.BOOLEAN = "boolean";
/**
 * SQL CLOB type. Your class's property type should be any Object.
 */
ColumnTypes.JSON = "json";
/**
 * SQL CLOB type. Your class's property type should be array of string. Note: value in this column should not contain
 * a comma (",") since this symbol is used to create a string from the array, using .join(",") operator.
 */
ColumnTypes.SIMPLE_ARRAY = "simple_array";
//# sourceMappingURL=ColumnTypes.js.map