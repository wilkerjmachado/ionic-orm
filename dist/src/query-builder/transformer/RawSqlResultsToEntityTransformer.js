import { OrmUtils } from "../../util/OrmUtils";
/**
 * Transforms raw sql results returned from the database into entity object.
 * Entity is constructed based on its entity metadata.
 */
export class RawSqlResultsToEntityTransformer {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(driver, aliasMap, joinMappings, relationCountMetas) {
        this.driver = driver;
        this.aliasMap = aliasMap;
        this.joinMappings = joinMappings;
        this.relationCountMetas = relationCountMetas;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    transform(rawSqlResults) {
        // console.log("rawSqlResults: ", rawSqlResults);
        return this.groupAndTransform(rawSqlResults, this.aliasMap.mainAlias);
    }
    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------
    /**
     * Since db returns a duplicated rows of the data where accuracies of the same object can be duplicated
     * we need to group our result and we must have some unique id (primary key in our case)
     */
    groupAndTransform(rawSqlResults, alias) {
        const metadata = this.aliasMap.getEntityMetadataByAlias(alias);
        if (!metadata)
            throw new Error("Cannot get entity metadata for the given alias " + alias.name);
        const groupedResults = OrmUtils.groupBy(rawSqlResults, result => {
            if (!metadata)
                return;
            return metadata.primaryColumnsWithParentIdColumns.map(column => result[alias.name + "_" + column.name]).join("_"); // todo: check it
        });
        // console.log("groupedResults: ", groupedResults);
        return groupedResults.map(group => {
            if (!metadata)
                return;
            return this.transformIntoSingleResult(group.items, alias, metadata);
        })
            .filter(res => !!res);
    }
    /**
     * Transforms set of data results into single entity.
     */
    transformIntoSingleResult(rawSqlResults, alias, metadata) {
        const entity = metadata.create();
        let hasData = false;
        this.joinMappings
            .filter(joinMapping => joinMapping.parentName === alias.name && !joinMapping.alias.parentAliasName && joinMapping.alias.target)
            .map(joinMapping => {
            const relatedEntities = this.groupAndTransform(rawSqlResults, joinMapping.alias);
            const isResultArray = joinMapping.isMany;
            const result = !isResultArray ? relatedEntities[0] : relatedEntities;
            if (result && (!isResultArray || result.length > 0)) {
                entity[joinMapping.propertyName] = result;
                hasData = true;
            }
        });
        // get value from columns selections and put them into object
        metadata.columns.forEach(column => {
            const columnName = column.name;
            const valueInObject = rawSqlResults[0][alias.name + "_" + columnName]; // we use zero index since its grouped data
            if (valueInObject !== undefined && valueInObject !== null && column.propertyName && !column.isVirtual && !column.isParentId && !column.isDiscriminator) {
                const value = this.driver.prepareHydratedValue(valueInObject, column);
                if (column.isInEmbedded) {
                    if (!entity[column.embeddedProperty])
                        entity[column.embeddedProperty] = column.embeddedMetadata.create();
                    entity[column.embeddedProperty][column.propertyName] = value;
                }
                else {
                    entity[column.propertyName] = value;
                }
                hasData = true;
            }
        });
        // add parent tables metadata
        // console.log(rawSqlResults);
        if (metadata.parentEntityMetadata) {
            metadata.parentEntityMetadata.columns.forEach(column => {
                const columnName = column.name;
                const valueInObject = rawSqlResults[0]["parentIdColumn_" + metadata.parentEntityMetadata.table.name + "_" + columnName]; // we use zero index since its grouped data
                if (valueInObject !== undefined && valueInObject !== null && column.propertyName && !column.isVirtual && !column.isParentId && !column.isDiscriminator) {
                    const value = this.driver.prepareHydratedValue(valueInObject, column);
                    if (column.isInEmbedded) {
                        if (!entity[column.embeddedProperty])
                            entity[column.embeddedProperty] = column.embeddedMetadata.create();
                        entity[column.embeddedProperty][column.propertyName] = value;
                    }
                    else {
                        entity[column.propertyName] = value;
                    }
                    hasData = true;
                }
            });
        }
        // if relation is loaded then go into it recursively and transform its values too
        metadata.relations.forEach(relation => {
            const relationAlias = this.aliasMap.findAliasByParent(alias.name, relation.propertyName);
            if (relationAlias) {
                const joinMapping = this.joinMappings.find(joinMapping => joinMapping.type === "join" && joinMapping.alias === relationAlias);
                const relatedEntities = this.groupAndTransform(rawSqlResults, relationAlias);
                const isResultArray = relation.isManyToMany || relation.isOneToMany;
                const result = !isResultArray ? relatedEntities[0] : relatedEntities;
                if (result && (!isResultArray || result.length > 0)) {
                    let propertyName = relation.propertyName;
                    if (joinMapping) {
                        propertyName = joinMapping.propertyName;
                    }
                    if (relation.isLazy) {
                        entity["__" + propertyName + "__"] = result;
                    }
                    else {
                        entity[propertyName] = result;
                    }
                    hasData = true;
                }
            }
            // if relation has id field then relation id/ids to that field.
            if (relation.isManyToMany) {
                if (relationAlias) {
                    const ids = [];
                    const joinMapping = this.joinMappings.find(joinMapping => joinMapping.type === "relationId" && joinMapping.alias === relationAlias);
                    if (relation.idField || joinMapping) {
                        const propertyName = joinMapping ? joinMapping.propertyName : relation.idField;
                        const junctionMetadata = relation.junctionEntityMetadata;
                        const columnName = relation.isOwning ? junctionMetadata.columns[1].name : junctionMetadata.columns[0].name;
                        rawSqlResults.forEach(results => {
                            if (relationAlias) {
                                const resultsKey = relationAlias.name + "_" + columnName;
                                const value = this.driver.prepareHydratedValue(results[resultsKey], relation.referencedColumn);
                                if (value !== undefined && value !== null)
                                    ids.push(value);
                            }
                        });
                        if (ids && ids.length)
                            entity[propertyName] = ids;
                    }
                }
            }
            else if (relation.idField) {
                const relationName = relation.name;
                entity[relation.idField] = this.driver.prepareHydratedValue(rawSqlResults[0][alias.name + "_" + relationName], relation.referencedColumn);
            }
            // if relation counter
            this.relationCountMetas.forEach(joinMeta => {
                if (joinMeta.alias === relationAlias) {
                    // console.log("relation count was found for relation: ", relation);
                    // joinMeta.entity = entity;
                    joinMeta.entities.push({ entity: entity, metadata: metadata });
                    // console.log(joinMeta);
                    // console.log("---------------------");
                }
            });
        });
        return hasData ? entity : null;
    }
}
//# sourceMappingURL=RawSqlResultsToEntityTransformer.js.map