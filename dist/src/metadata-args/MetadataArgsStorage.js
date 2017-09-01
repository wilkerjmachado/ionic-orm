import { TargetMetadataArgsCollection } from "./collection/TargetMetadataArgsCollection";
import { PropertyMetadataArgsCollection } from "./collection/PropertyMetadataArgsCollection";
/**
 * Storage all metadatas of all available types: tables, fields, subscribers, relations, etc.
 * Each metadata represents some specifications of what it represents.
 */
export class MetadataArgsStorage {
    constructor() {
        // todo: type in function validation, inverse side function validation
        // todo: check on build for duplicate names, since naming checking was removed from MetadataStorage
        // todo: duplicate name checking for: table, relation, column, index, naming strategy, join tables/columns?
        // todo: check for duplicate targets too since this check has been removed too
        // -------------------------------------------------------------------------
        // Properties
        // -------------------------------------------------------------------------
        this.tables = new TargetMetadataArgsCollection();
        this.namingStrategies = new TargetMetadataArgsCollection();
        this.entitySubscribers = new TargetMetadataArgsCollection();
        this.indices = new TargetMetadataArgsCollection();
        this.columns = new PropertyMetadataArgsCollection();
        this.relations = new PropertyMetadataArgsCollection();
        this.joinColumns = new PropertyMetadataArgsCollection();
        this.joinTables = new PropertyMetadataArgsCollection();
        this.entityListeners = new PropertyMetadataArgsCollection();
        this.relationCounts = new PropertyMetadataArgsCollection();
        this.relationIds = new PropertyMetadataArgsCollection();
        this.embeddeds = new PropertyMetadataArgsCollection();
        this.inheritances = new TargetMetadataArgsCollection();
        this.discriminatorValues = new TargetMetadataArgsCollection();
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Gets merged (with all abstract classes) table metadatas for the given classes.
     */
    getMergedTableMetadatas(classes) {
        const allTableMetadataArgs = classes ? this.tables.filterByTargets(classes) : this.tables;
        const tableMetadatas = allTableMetadataArgs.filter(table => table.type === "regular" || table.type === "closure" || table.type === "class-table-child");
        return tableMetadatas.map(tableMetadata => {
            return this.mergeWithAbstract(allTableMetadataArgs, tableMetadata);
        });
    }
    /**
     * Gets merged (with all abstract classes) embeddable table metadatas for the given classes.
     */
    getMergedEmbeddableTableMetadatas(classes) {
        const tables = classes ? this.tables.filterByTargets(classes) : this.tables;
        const embeddableTableMetadatas = tables.filter(table => table.type === "embeddable");
        return embeddableTableMetadatas.map(embeddableTableMetadata => {
            return this.mergeWithEmbeddable(embeddableTableMetadatas, embeddableTableMetadata);
        });
    }
    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------
    /**
     */
    mergeWithAbstract(allTableMetadatas, table) {
        const indices = this.indices.filterByTarget(table.target);
        const columns = this.columns.filterByTarget(table.target);
        const relations = this.relations.filterByTarget(table.target);
        const joinColumns = this.joinColumns.filterByTarget(table.target);
        const joinTables = this.joinTables.filterByTarget(table.target);
        const entityListeners = this.entityListeners.filterByTarget(table.target);
        const relationCounts = this.relationCounts.filterByTarget(table.target);
        const relationIds = this.relationIds.filterByTarget(table.target);
        const embeddeds = this.embeddeds.filterByTarget(table.target);
        const inheritances = this.inheritances.filterByTarget(table.target);
        const inheritance = (inheritances.length > 0) ? inheritances[0] : undefined;
        const discriminatorValues = [];
        // find parent if this table is class-table-child
        let parent = undefined;
        // merge metadata from abstract tables
        allTableMetadatas.forEach(inheritedTable => {
            if (table.type === "single-table-child")
                return;
            if (!table.target || !inheritedTable.target)
                return;
            if (!(table.target instanceof Function) || !(inheritedTable.target instanceof Function))
                return;
            if (!this.isInherited(table.target, inheritedTable.target))
                return;
            // check if inheritedTable is a class with class table inheritance - then we don't need to merge its columns, relations, etc. things
            if (!!this.inheritances.filterByTarget(inheritedTable.target).find(inheritance => inheritance.type === "class-table")) {
                parent = inheritedTable;
                return;
            }
            const metadatasFromAbstract = this.mergeWithAbstract(allTableMetadatas, inheritedTable);
            metadatasFromAbstract.columns
                .filterRepeatedMetadatas(columns)
                .forEach(metadata => columns.push(metadata));
            metadatasFromAbstract.relations
                .filterRepeatedMetadatas(relations)
                .forEach(metadata => relations.push(metadata));
            metadatasFromAbstract.joinColumns
                .filterRepeatedMetadatas(joinColumns)
                .forEach(metadata => joinColumns.push(metadata));
            metadatasFromAbstract.joinTables
                .filterRepeatedMetadatas(joinTables)
                .forEach(metadata => joinTables.push(metadata));
            metadatasFromAbstract.entityListeners
                .filterRepeatedMetadatas(entityListeners)
                .forEach(metadata => entityListeners.push(metadata));
            metadatasFromAbstract.relationCounts
                .filterRepeatedMetadatas(relationCounts)
                .forEach(metadata => relationCounts.push(metadata));
            metadatasFromAbstract.relationIds
                .filterRepeatedMetadatas(relationIds)
                .forEach(metadata => relationIds.push(metadata));
            metadatasFromAbstract.embeddeds
                .filterRepeatedMetadatas(embeddeds)
                .forEach(metadata => embeddeds.push(metadata));
        });
        // merge metadata from child tables for single-table inheritance
        const children = [];
        if (inheritance && inheritance.type === "single-table") {
            allTableMetadatas.forEach(childTable => {
                if (childTable.type !== "single-table-child")
                    return;
                if (!childTable.target || !table.target)
                    return;
                if (!(childTable.target instanceof Function) || !(table.target instanceof Function))
                    return;
                if (!this.isInherited(childTable.target, table.target))
                    return;
                children.push(childTable);
                this.discriminatorValues
                    .filterByTarget(childTable.target)
                    .forEach(metadata => discriminatorValues.push(metadata));
                // for single table inheritance we also merge all columns, relation, etc. into same table
                if (inheritance.type === "single-table") {
                    const metadatasFromAbstract = this.mergeWithAbstract(allTableMetadatas, childTable);
                    metadatasFromAbstract.columns
                        .filterRepeatedMetadatas(columns)
                        .forEach(metadata => columns.push(metadata));
                    metadatasFromAbstract.relations
                        .filterRepeatedMetadatas(relations)
                        .forEach(metadata => relations.push(metadata));
                    metadatasFromAbstract.joinColumns
                        .filterRepeatedMetadatas(joinColumns)
                        .forEach(metadata => joinColumns.push(metadata));
                    metadatasFromAbstract.joinTables
                        .filterRepeatedMetadatas(joinTables)
                        .forEach(metadata => joinTables.push(metadata));
                    metadatasFromAbstract.entityListeners
                        .filterRepeatedMetadatas(entityListeners)
                        .forEach(metadata => entityListeners.push(metadata));
                    metadatasFromAbstract.relationCounts
                        .filterRepeatedMetadatas(relationCounts)
                        .forEach(metadata => relationCounts.push(metadata));
                    metadatasFromAbstract.relationIds
                        .filterRepeatedMetadatas(relationIds)
                        .forEach(metadata => relationIds.push(metadata));
                    metadatasFromAbstract.embeddeds
                        .filterRepeatedMetadatas(embeddeds)
                        .forEach(metadata => embeddeds.push(metadata));
                    metadatasFromAbstract.children
                        .forEach(metadata => children.push(metadata));
                }
            });
        }
        return {
            table: table,
            parent: parent,
            inheritance: inheritance,
            children: children,
            indices: indices,
            columns: columns,
            relations: relations,
            joinColumns: joinColumns,
            joinTables: joinTables,
            entityListeners: entityListeners,
            relationCounts: relationCounts,
            relationIds: relationIds,
            embeddeds: embeddeds,
            discriminatorValues: discriminatorValues
        };
    }
    /**
     */
    mergeWithEmbeddable(allTableMetadatas, tableMetadata) {
        const columns = this.columns.filterByTarget(tableMetadata.target);
        allTableMetadatas
            .filter(metadata => {
            if (!tableMetadata.target || !metadata.target)
                return false;
            if (!(tableMetadata.target instanceof Function) || !(metadata.target instanceof Function))
                return false;
            return this.isInherited(tableMetadata.target, metadata.target); // todo: fix it for entity schema
        })
            .forEach(parentMetadata => {
            const metadatasFromParents = this.mergeWithEmbeddable(allTableMetadatas, parentMetadata);
            metadatasFromParents.columns
                .filterRepeatedMetadatas(columns)
                .forEach(metadata => columns.push(metadata));
        });
        return {
            table: tableMetadata,
            columns: columns
        };
    }
    /**
     * Checks if this table is inherited from another table.
     */
    isInherited(target1, target2) {
        // we cannot use instanceOf in this method, because we need order of inherited tables, to ensure that
        // properties get inherited in a right order. To achieve it we can only check a first parent of the class
        // return this.target.prototype instanceof anotherTable.target;
        return Object.getPrototypeOf(target1.prototype).constructor === target2;
    }
}
//# sourceMappingURL=MetadataArgsStorage.js.map