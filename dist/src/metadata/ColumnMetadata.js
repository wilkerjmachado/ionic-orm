/**
 * This metadata contains all information about entity's column.
 */
export class ColumnMetadata {
    // ---------------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------------
    constructor(args) {
        /**
         * Type's length in the database.
         */
        this.length = "";
        /**
         * Indicates if this column is a primary key.
         */
        this.isPrimary = false;
        /**
         * Indicates if this column is generated (auto increment or generated other way).
         */
        this.isGenerated = false;
        /**
         * Indicates if value in the database should be unique or not.
         */
        this.isUnique = false;
        /**
         * Indicates if column can contain nulls or not.
         */
        this.isNullable = false;
        /**
         * Column comment.
         */
        this.comment = "";
        this.target = args.target;
        this.propertyName = args.propertyName;
        if (args.mode)
            this.mode = args.mode;
        if (args.propertyType)
            this.propertyType = args.propertyType.toLowerCase();
        if (args.options.name)
            this._name = args.options.name;
        if (args.options.type)
            this.type = args.options.type;
        if (args.options.length)
            this.length = args.options.length;
        if (args.options.primary)
            this.isPrimary = args.options.primary;
        if (args.options.generated)
            this.isGenerated = args.options.generated;
        if (args.options.unique)
            this.isUnique = args.options.unique;
        if (args.options.nullable)
            this.isNullable = args.options.nullable;
        if (args.options.comment)
            this.comment = args.options.comment;
        if (args.options.default)
            this.default = args.options.default;
        if (args.options.scale)
            this.scale = args.options.scale;
        if (args.options.precision)
            this.precision = args.options.precision;
        if (args.options.timezone)
            this.timezone = args.options.timezone;
    }
    // ---------------------------------------------------------------------
    // Accessors
    // ---------------------------------------------------------------------
    /**
     * Gets column's entity target.
     * Original target returns target of the class where column is.
     * This class can be an abstract class, but column even is from that class,
     * but its more related to a specific entity. That's why we need this field.
     */
    get entityTarget() {
        return this.entityMetadata.target;
    }
    /**
     * Column name in the database.
     */
    get name() {
        // if this column is embedded's column then apply different entity
        if (this.embeddedMetadata)
            return this.embeddedMetadata.entityMetadata.namingStrategy.embeddedColumnName(this.embeddedMetadata.propertyName, this.propertyName, this._name);
        // if there is a naming strategy then use it to normalize propertyName as column name
        if (this.entityMetadata)
            return this.entityMetadata.namingStrategy.columnName(this.propertyName, this._name);
        throw new Error(`Column ${this._name ? this._name + " " : ""}is not attached to any entity or embedded.`);
    }
    /**
     * Indicates if this column is in embedded, not directly in the table.
     */
    get isInEmbedded() {
        return !!this.embeddedMetadata;
    }
    /**
     * Indicates if column is virtual. Virtual columns are not mapped to the entity.
     */
    get isVirtual() {
        return this.mode === "virtual";
    }
    /**
     * Indicates if column is a parent id. Parent id columns are not mapped to the entity.
     */
    get isParentId() {
        return this.mode === "parentId";
    }
    /**
     * Indicates if column is discriminator. Discriminator columns are not mapped to the entity.
     */
    get isDiscriminator() {
        return this.mode === "discriminator";
    }
    /**
     * Indicates if this column contains an entity creation date.
     */
    get isCreateDate() {
        return this.mode === "createDate";
    }
    /**
     * Indicates if this column contains an entity update date.
     */
    get isUpdateDate() {
        return this.mode === "updateDate";
    }
    /**
     * Indicates if this column contains an entity version.
     */
    get isVersion() {
        return this.mode === "version";
    }
    /**
     * Gets embedded property in which column is.
     */
    get embeddedProperty() {
        if (!this.embeddedMetadata)
            throw new Error(`This column${this._name ? this._name + " " : ""} is not in embedded entity.`);
        return this.embeddedMetadata.propertyName;
    }
    // ---------------------------------------------------------------------
    // Public Methods
    // ---------------------------------------------------------------------
    hasEntityValue(entity) {
        if (!entity)
            return false;
        if (this.isInEmbedded) {
            return entity[this.embeddedProperty] !== undefined &&
                entity[this.embeddedProperty] !== null &&
                entity[this.embeddedProperty][this.propertyName] !== undefined &&
                entity[this.embeddedProperty][this.propertyName] !== null;
        }
        else {
            return entity[this.propertyName] !== undefined &&
                entity[this.propertyName] !== null;
        }
    }
    getEntityValue(entity) {
        if (this.isInEmbedded) {
            if (entity[this.embeddedProperty] === undefined ||
                entity[this.embeddedProperty] === null)
                return undefined;
            return entity[this.embeddedProperty][this.propertyName];
        }
        else {
            return entity[this.propertyName];
        }
    }
    get normalizedDataType() {
        if (typeof this.type === "string") {
            return this.type.toLowerCase();
        }
        else if (typeof this.type === "object" &&
            this.type.name &&
            typeof this.type.name === "string") {
            return this.type.toLowerCase(); // todo: shouldnt be a .name here?
        }
        throw new Error(`Column data type cannot be normalized. Make sure you have supplied a correct column type.`);
    }
}
//# sourceMappingURL=ColumnMetadata.js.map