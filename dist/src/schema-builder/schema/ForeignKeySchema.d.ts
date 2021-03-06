import { ForeignKeyMetadata } from "../../metadata/ForeignKeyMetadata";
/**
 * Foreign key from the database stored in this class.
 */
export declare class ForeignKeySchema {
    /**
     * Name of the table which contains this foreign key.
     */
    name: string;
    /**
     * Column names which included by this foreign key.
     */
    columnNames: string[];
    /**
     * Table referenced in the foreign key.
     */
    referencedTableName: string;
    /**
     * Column names which included by this foreign key.
     */
    referencedColumnNames: string[];
    /**
     * "ON DELETE" of this foreign key, e.g. what action database should perform when
     * referenced stuff is being deleted.
     */
    onDelete?: string;
    constructor(name: string, columnNames: string[], referencedColumnNames: string[], referencedTable: string, onDelete?: string);
    /**
     * Creates a new copy of this foreign key with exactly same properties.
     */
    clone(): ForeignKeySchema;
    /**
     * Creates a new foreign schema from the given foreign key metadata.
     */
    static create(metadata: ForeignKeyMetadata): ForeignKeySchema;
}
