import { RelationTypes } from "./types/RelationTypes";
// todo: IDEA. store all entity metadata in the EntityMetadata too? (this will open more features for metadata objects + no need to access connection in lot of places)
/**
 * Contains all entity metadata.
 */
export class EntityMetadata {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(args, lazyRelationsWrapper) {
        this.lazyRelationsWrapper = lazyRelationsWrapper;
        /**
         * Entity's foreign key metadatas.
         */
        this.foreignKeys = [];
        this.target = args.target;
        this.tablesPrefix = args.tablesPrefix;
        this.namingStrategy = args.namingStrategy;
        this.table = args.tableMetadata;
        this._columns = args.columnMetadatas || [];
        this.relations = args.relationMetadatas || [];
        this.indices = args.indexMetadatas || [];
        this.foreignKeys = args.foreignKeyMetadatas || [];
        this.embeddeds = args.embeddedMetadatas || [];
        this.discriminatorValue = args.discriminatorValue;
        this.inheritanceType = args.inheritanceType;
        this.table.entityMetadata = this;
        this._columns.forEach(column => column.entityMetadata = this);
        this.relations.forEach(relation => relation.entityMetadata = this);
        this.foreignKeys.forEach(foreignKey => foreignKey.entityMetadata = this);
        this.indices.forEach(index => index.entityMetadata = this);
        this.embeddeds.forEach(embedded => {
            embedded.entityMetadata = this;
            embedded.columns.forEach(column => column.entityMetadata = this);
        });
    }
    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------
    /**
     * Entity's name. Equal to entity target class's name if target is set to table, or equals to table name if its set.
     */
    get name() {
        if (!this.table)
            throw new Error("No table target set to the entity metadata.");
        return this.targetName ? this.targetName : this.table.name;
    }
    /**
     * Columns of the entity, including columns that are coming from the embeddeds of this entity.
     */
    get columns() {
        let allColumns = [].concat(this._columns);
        this.embeddeds.forEach(embedded => {
            allColumns = allColumns.concat(embedded.columns);
        });
        return allColumns;
    }
    /**
     * All columns of the entity, including columns that are coming from the embeddeds of this entity,
     * and including columns from the parent entities.
     */
    get allColumns() {
        let columns = this.columns;
        if (this.parentEntityMetadata)
            columns = columns.concat(this.parentEntityMetadata.columns);
        return columns;
    }
    /**
     * All relations of the entity, including relations from the parent entities.
     */
    get allRelations() {
        let relations = this.relations;
        if (this.parentEntityMetadata)
            relations = relations.concat(this.parentEntityMetadata.relations);
        return relations;
    }
    /**
     * Gets the name of the target.
     */
    get targetName() {
        if (typeof this.target === "string")
            return this.target;
        if (this.target instanceof Function)
            return this.target.name;
        return "";
    }
    /**
     * Checks if entity's table has multiple primary columns.
     */
    get hasMultiplePrimaryKeys() {
        return this.primaryColumns.length > 1;
    }
    /**
     * Gets the primary column.
     *
     * @deprecated
     */
    get primaryColumn() {
        const primaryKey = this.primaryColumns[0];
        if (!primaryKey)
            throw new Error(`Primary key is not set for the ${this.name} entity.`);
        return primaryKey;
    }
    /**
     * Checks if table has generated column.
     */
    get hasGeneratedColumn() {
        return !!this.generatedColumnIfExist;
    }
    /**
     * Gets the column with generated flag.
     */
    get generatedColumn() {
        const generatedColumn = this.generatedColumnIfExist;
        if (!generatedColumn)
            throw new Error(`Generated column was not found`);
        return generatedColumn;
    }
    /**
     * Gets the generated column if it exists, or returns undefined if it does not.
     */
    get generatedColumnIfExist() {
        return this._columns.find(column => column.isGenerated);
    }
    /**
     * Gets first primary column. In the case if table contains multiple primary columns it
     * throws error.
     */
    get firstPrimaryColumn() {
        if (this.hasMultiplePrimaryKeys)
            throw new Error(`Entity ${this.name} has multiple primary keys. This operation is not supported on entities with multiple primary keys`);
        return this.primaryColumns[0];
    }
    /**
     * Checks if entity has any primary columns.

    get hasPrimaryColumns(): ColumnMetadata[] {

    }*/
    /**
     * Gets the primary columns.
     */
    get primaryColumns() {
        // const originalPrimaryColumns = this._columns.filter(column => column.isPrimary);
        // const parentEntityPrimaryColumns = this.hasParentIdColumn ? [this.parentIdColumn] : [];
        // return originalPrimaryColumns.concat(parentEntityPrimaryColumns);
        return this._columns.filter(column => column.isPrimary);
        // const originalPrimaryColumns = this._columns.filter(column => column.isPrimary);
        // const parentEntityPrimaryColumns = this.parentEntityMetadata ? this.parentEntityMetadata.primaryColumns : [];
        // return originalPrimaryColumns.concat(parentEntityPrimaryColumns);
    }
    get primaryColumnsWithParentIdColumns() {
        return this.primaryColumns.concat(this.parentIdColumns);
    }
    get primaryColumnsWithParentPrimaryColumns() {
        return this.primaryColumns.concat(this.parentPrimaryColumns);
    }
    /**
     * Gets the primary columns of the parent entity metadata.
     * If parent entity metadata does not exist then it simply returns empty array.
     */
    get parentPrimaryColumns() {
        if (this.parentEntityMetadata)
            return this.parentEntityMetadata.primaryColumns;
        return [];
    }
    /**
     * Gets only primary columns owned by this entity.
     */
    get ownPimaryColumns() {
        return this._columns.filter(column => column.isPrimary);
    }
    /**
     * Checks if entity has a create date column.
     */
    get hasCreateDateColumn() {
        return !!this._columns.find(column => column.mode === "createDate");
    }
    /**
     * Gets entity column which contains a create date value.
     */
    get createDateColumn() {
        const column = this._columns.find(column => column.mode === "createDate");
        if (!column)
            throw new Error(`CreateDateColumn was not found in entity ${this.name}`);
        return column;
    }
    /**
     * Checks if entity has an update date column.
     */
    get hasUpdateDateColumn() {
        return !!this._columns.find(column => column.mode === "updateDate");
    }
    /**
     * Gets entity column which contains an update date value.
     */
    get updateDateColumn() {
        const column = this._columns.find(column => column.mode === "updateDate");
        if (!column)
            throw new Error(`UpdateDateColumn was not found in entity ${this.name}`);
        return column;
    }
    /**
     * Checks if entity has a version column.
     */
    get hasVersionColumn() {
        return !!this._columns.find(column => column.mode === "version");
    }
    /**
     * Gets entity column which contains an entity version.
     */
    get versionColumn() {
        const column = this._columns.find(column => column.mode === "version");
        if (!column)
            throw new Error(`VersionColumn was not found in entity ${this.name}`);
        return column;
    }
    /**
     * Checks if entity has a discriminator column.
     */
    get hasDiscriminatorColumn() {
        return !!this._columns.find(column => column.mode === "discriminator");
    }
    /**
     * Gets the discriminator column used to store entity identificator in single-table inheritance tables.
     */
    get discriminatorColumn() {
        const column = this._columns.find(column => column.mode === "discriminator");
        if (!column)
            throw new Error(`DiscriminatorColumn was not found in entity ${this.name}`);
        return column;
    }
    /**
     * Checks if entity has a tree level column.
     */
    get hasTreeLevelColumn() {
        return !!this._columns.find(column => column.mode === "treeLevel");
    }
    get treeLevelColumn() {
        const column = this._columns.find(column => column.mode === "treeLevel");
        if (!column)
            throw new Error(`TreeLevelColumn was not found in entity ${this.name}`);
        return column;
    }
    /**
     * Checks if entity has a tree level column.
     */
    get hasParentIdColumn() {
        return !!this._columns.find(column => column.mode === "parentId");
    }
    get parentIdColumn() {
        const column = this._columns.find(column => column.mode === "parentId");
        if (!column)
            throw new Error(`Parent id column was not found in entity ${this.name}`);
        return column;
    }
    get parentIdColumns() {
        return this._columns.filter(column => column.mode === "parentId");
    }
    /**
     * Gets single (values of which does not contain arrays) relations.
     */
    get singleValueRelations() {
        return this.relations.filter(relation => {
            return relation.relationType === RelationTypes.ONE_TO_ONE || relation.relationType === RelationTypes.ONE_TO_MANY;
        });
    }
    /**
     * Gets single (values of which does not contain arrays) relations.
     */
    get multiValueRelations() {
        return this.relations.filter(relation => {
            return relation.relationType === RelationTypes.ONE_TO_ONE || relation.relationType === RelationTypes.ONE_TO_MANY;
        });
    }
    /**
     * Gets only one-to-one relations of the entity.
     */
    get oneToOneRelations() {
        return this.relations.filter(relation => relation.relationType === RelationTypes.ONE_TO_ONE);
    }
    /**
     * Gets only owner one-to-one relations of the entity.
     */
    get ownerOneToOneRelations() {
        return this.relations.filter(relation => relation.relationType === RelationTypes.ONE_TO_ONE && relation.isOwning);
    }
    /**
     * Gets only one-to-many relations of the entity.
     */
    get oneToManyRelations() {
        return this.relations.filter(relation => relation.relationType === RelationTypes.ONE_TO_MANY);
    }
    /**
     * Gets only many-to-one relations of the entity.
     */
    get manyToOneRelations() {
        return this.relations.filter(relation => relation.relationType === RelationTypes.MANY_TO_ONE);
    }
    /**
     * Gets only many-to-many relations of the entity.
     */
    get manyToManyRelations() {
        return this.relations.filter(relation => relation.relationType === RelationTypes.MANY_TO_MANY);
    }
    /**
     * Gets only owner many-to-many relations of the entity.
     */
    get ownerManyToManyRelations() {
        return this.relations.filter(relation => relation.relationType === RelationTypes.MANY_TO_MANY && relation.isOwning);
    }
    /**
     * Gets only owner one-to-one and many-to-one relations.
     */
    get relationsWithJoinColumns() {
        return this.ownerOneToOneRelations.concat(this.manyToOneRelations);
    }
    /**
     * Checks if there is a tree parent relation. Used only in tree-tables.
     */
    get hasTreeParentRelation() {
        return !!this.relations.find(relation => relation.isTreeParent);
    }
    /**
     * Tree parent relation. Used only in tree-tables.
     */
    get treeParentRelation() {
        const relation = this.relations.find(relation => relation.isTreeParent);
        if (!relation)
            throw new Error(`TreeParent relation was not found in entity ${this.name}`);
        return relation;
    }
    /**
     * Checks if there is a tree children relation. Used only in tree-tables.
     */
    get hasTreeChildrenRelation() {
        return !!this.relations.find(relation => relation.isTreeChildren);
    }
    /**
     * Tree children relation. Used only in tree-tables.
     */
    get treeChildrenRelation() {
        const relation = this.relations.find(relation => relation.isTreeChildren);
        if (!relation)
            throw new Error(`TreeParent relation was not found in entity ${this.name}`);
        return relation;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Creates a new entity.
     */
    create() {
        // if target is set to a function (e.g. class) that can be created then create it
        if (this.target instanceof Function)
            return new this.target();
        // otherwise simply return a new empty object
        const newObject = {};
        this.relations
            .filter(relation => relation.isLazy)
            .forEach(relation => this.lazyRelationsWrapper.wrap(newObject, relation));
        return newObject;
    }
    /**
     * Creates an object - map of columns and relations of the entity.
     */
    createPropertiesMap() {
        const entity = {};
        this._columns.forEach(column => entity[column.propertyName] = column.propertyName);
        this.relations.forEach(relation => entity[relation.propertyName] = relation.propertyName);
        return entity;
    }
    /**
     * Computes property name of the entity using given PropertyTypeInFunction.
     */
    computePropertyName(nameOrFn) {
        return typeof nameOrFn === "string" ? nameOrFn : nameOrFn(this.createPropertiesMap());
    }
    getEntityIdMap(entity) {
        if (!entity)
            return undefined;
        const map = {};
        if (this.parentEntityMetadata) {
            this.primaryColumnsWithParentIdColumns.forEach(column => {
                map[column.propertyName] = entity[column.propertyName];
            });
        }
        else {
            this.primaryColumns.forEach(column => {
                map[column.propertyName] = entity[column.propertyName];
            });
        }
        const hasAllIds = this.primaryColumns.every(primaryColumn => {
            return map[primaryColumn.propertyName] !== undefined && map[primaryColumn.propertyName] !== null;
        });
        return hasAllIds ? map : undefined;
    }
    /**
     * Same as `getEntityIdMap` but the key of the map will be the column names instead of the property names.
     */
    getEntityIdColumnMap(entity) {
        return this.transformIdMapToColumnNames(this.getEntityIdMap(entity));
    }
    transformIdMapToColumnNames(idMap) {
        if (!idMap) {
            return idMap;
        }
        const map = {};
        Object.keys(idMap).forEach(propertyName => {
            const column = this.getColumnByPropertyName(propertyName);
            if (column) {
                map[column.name] = idMap[propertyName];
            }
        });
        return map;
    }
    getColumnByPropertyName(propertyName) {
        return this._columns.find(column => column.propertyName === propertyName);
    }
    /**
     * Checks if column with the given property name exist.
     */
    hasColumnWithPropertyName(propertyName) {
        return !!this._columns.find(column => column.propertyName === propertyName);
    }
    /**
     * Checks if column with the given database name exist.
     */
    hasColumnWithDbName(name) {
        return !!this._columns.find(column => column.name === name);
    }
    /**
     * Checks if relation with the given property name exist.
     */
    hasRelationWithPropertyName(propertyName) {
        return !!this.relations.find(relation => relation.propertyName === propertyName);
    }
    /**
     * Finds relation with the given property name.
     */
    findRelationWithPropertyName(propertyName) {
        const relation = this.relations.find(relation => relation.propertyName === propertyName);
        if (!relation)
            throw new Error(`Relation with property name ${propertyName} in ${this.name} entity was not found.`);
        return relation;
    }
    /**
     * Checks if relation with the given name exist.
     */
    hasRelationWithDbName(dbName) {
        return !!this.relationsWithJoinColumns.find(relation => relation.name === dbName);
    }
    /**
     * Finds relation with the given name.
     */
    findRelationWithDbName(name) {
        const relation = this.relationsWithJoinColumns.find(relation => relation.name === name);
        if (!relation)
            throw new Error(`Relation with name ${name} in ${this.name} entity was not found.`);
        return relation;
    }
    addColumn(column) {
        this._columns.push(column);
        column.entityMetadata = this;
    }
    extractNonEmptyColumns(object) {
        return this.columns.filter(column => !!object[column.propertyName]);
    }
    extractNonEmptySingleValueRelations(object) {
        return this.relations.filter(relation => {
            return (relation.relationType === RelationTypes.ONE_TO_ONE || relation.relationType === RelationTypes.MANY_TO_ONE)
                && !!object[relation.propertyName];
        });
    }
    extractNonEmptyMultiValueRelations(object) {
        return this.relations.filter(relation => {
            return (relation.relationType === RelationTypes.MANY_TO_MANY || relation.relationType === RelationTypes.ONE_TO_MANY)
                && !!object[relation.propertyName];
        });
    }
    extractExistSingleValueRelations(object) {
        return this.relations.filter(relation => {
            return (relation.relationType === RelationTypes.ONE_TO_ONE || relation.relationType === RelationTypes.MANY_TO_ONE)
                && object.hasOwnProperty(relation.propertyName);
        });
    }
    extractExistMultiValueRelations(object) {
        return this.relations.filter(relation => {
            return (relation.relationType === RelationTypes.MANY_TO_MANY || relation.relationType === RelationTypes.ONE_TO_MANY)
                && object.hasOwnProperty(relation.propertyName);
        });
    }
    checkIfObjectContainsAllPrimaryKeys(object) {
        return this.primaryColumns.every(primaryColumn => {
            return object.hasOwnProperty(primaryColumn.propertyName);
        });
    }
    compareEntities(firstEntity, secondEntity) {
        const firstEntityIds = this.getEntityIdMap(firstEntity);
        const secondEntityIds = this.getEntityIdMap(secondEntity);
        return this.compareIds(firstEntityIds, secondEntityIds);
    }
    compareIds(firstIds, secondIds) {
        if (!firstIds || !secondIds)
            return false;
        return Object.keys(firstIds).every(key => {
            return firstIds[key] === secondIds[key];
        });
    }
    /**
     * Iterates throw entity and finds and extracts all values from relations in the entity.
     * If relation value is an array its being flattened.
     */
    extractRelationValuesFromEntity(entity, relations) {
        const relationsAndValues = [];
        relations.forEach(relation => {
            const value = relation.getEntityValue(entity);
            if (value instanceof Array) {
                value.forEach(subValue => relationsAndValues.push([relation, subValue]));
            }
            else if (value) {
                relationsAndValues.push([relation, value]);
            }
        });
        return relationsAndValues;
    }
}
//# sourceMappingURL=EntityMetadata.js.map