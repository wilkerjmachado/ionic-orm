var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { OperateEntity } from "../persistment/operation/PersistOperation";
import { QueryRunnerProvider } from "../query-runner/QueryRunnerProvider";
/**
 * Repository for more specific operations.
 */
export class SpecificRepository {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(connection, metadata, repository, queryRunnerProvider) {
        this.connection = connection;
        this.metadata = metadata;
        this.repository = repository;
        if (queryRunnerProvider) {
            this.queryRunnerProvider = queryRunnerProvider;
        }
        else {
            this.queryRunnerProvider = new QueryRunnerProvider(connection.driver);
        }
    }
    /**
     * Sets given relatedEntityId to the value of the relation of the entity with entityId id.
     * Should be used when you want quickly and efficiently set a relation (for many-to-one and one-to-many) to some entity.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    setRelation(relationName, entityId, relatedEntityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const propertyName = this.metadata.computePropertyName(relationName);
            if (!this.metadata.hasRelationWithPropertyName(propertyName))
                throw new Error(`Relation ${propertyName} was not found in the ${this.metadata.name} entity.`);
            const relation = this.metadata.findRelationWithPropertyName(propertyName);
            // if (relation.isManyToMany || relation.isOneToMany || relation.isOneToOneNotOwner)
            //     throw new Error(`Only many-to-one and one-to-one with join column are supported for this operation. ${this.metadata.name}#${propertyName} relation type is ${relation.relationType}`);
            if (relation.isManyToMany)
                throw new Error(`Many-to-many relation is not supported for this operation. Use #addToRelation method for many-to-many relations.`);
            let table, values = {}, conditions = {};
            if (relation.isOwning) {
                table = relation.entityMetadata.table.name;
                values[relation.name] = relatedEntityId;
                conditions[relation.joinColumn.referencedColumn.name] = entityId;
            }
            else {
                table = relation.inverseEntityMetadata.table.name;
                values[relation.inverseRelation.name] = relatedEntityId;
                conditions[relation.inverseRelation.joinColumn.referencedColumn.name] = entityId;
            }
            const queryRunner = yield this.queryRunnerProvider.provide();
            yield queryRunner.update(table, values, conditions);
            yield this.queryRunnerProvider.release(queryRunner);
        });
    }
    /**
     * Sets given relatedEntityId to the value of the relation of the entity with entityId id.
     * Should be used when you want quickly and efficiently set a relation (for many-to-one and one-to-many) to some entity.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    setInverseRelation(relationName, relatedEntityId, entityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const propertyName = this.metadata.computePropertyName(relationName);
            if (!this.metadata.hasRelationWithPropertyName(propertyName))
                throw new Error(`Relation ${propertyName} was not found in the ${this.metadata.name} entity.`);
            const relation = this.metadata.findRelationWithPropertyName(propertyName);
            // if (relation.isManyToMany || relation.isOneToMany || relation.isOneToOneNotOwner)
            //     throw new Error(`Only many-to-one and one-to-one with join column are supported for this operation. ${this.metadata.name}#${propertyName} relation type is ${relation.relationType}`);
            if (relation.isManyToMany)
                throw new Error(`Many-to-many relation is not supported for this operation. Use #addToRelation method for many-to-many relations.`);
            let table, values = {}, conditions = {};
            if (relation.isOwning) {
                table = relation.inverseEntityMetadata.table.name;
                values[relation.inverseRelation.name] = relatedEntityId;
                conditions[relation.inverseRelation.joinColumn.referencedColumn.name] = entityId;
            }
            else {
                table = relation.entityMetadata.table.name;
                values[relation.name] = relatedEntityId;
                conditions[relation.joinColumn.referencedColumn.name] = entityId;
            }
            const queryRunner = yield this.queryRunnerProvider.provide();
            yield queryRunner.update(table, values, conditions);
            yield this.queryRunnerProvider.release(queryRunner);
        });
    }
    /**
     * Adds a new relation between two entities into relation's many-to-many table.
     * Should be used when you want quickly and efficiently add a relation between two entities.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    addToRelation(relationName, entityId, relatedEntityIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const propertyName = this.metadata.computePropertyName(relationName);
            if (!this.metadata.hasRelationWithPropertyName(propertyName))
                throw new Error(`Relation ${propertyName} was not found in the ${this.metadata.name} entity.`);
            const relation = this.metadata.findRelationWithPropertyName(propertyName);
            if (!relation.isManyToMany)
                throw new Error(`Only many-to-many relation supported for this operation. However ${this.metadata.name}#${propertyName} relation type is ${relation.relationType}`);
            const queryRunner = yield this.queryRunnerProvider.provide();
            const insertPromises = relatedEntityIds.map(relatedEntityId => {
                const values = {};
                if (relation.isOwning) {
                    values[relation.junctionEntityMetadata.columns[0].name] = entityId;
                    values[relation.junctionEntityMetadata.columns[1].name] = relatedEntityId;
                }
                else {
                    values[relation.junctionEntityMetadata.columns[1].name] = entityId;
                    values[relation.junctionEntityMetadata.columns[0].name] = relatedEntityId;
                }
                return queryRunner.insert(relation.junctionEntityMetadata.table.name, values);
            });
            yield Promise.all(insertPromises);
            yield this.queryRunnerProvider.release(queryRunner);
        });
    }
    /**
     * Adds a new relation between two entities into relation's many-to-many table from inverse side of the given relation.
     * Should be used when you want quickly and efficiently add a relation between two entities.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    addToInverseRelation(relationName, relatedEntityId, entityIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const propertyName = this.metadata.computePropertyName(relationName);
            if (!this.metadata.hasRelationWithPropertyName(propertyName))
                throw new Error(`Relation ${propertyName} was not found in the ${this.metadata.name} entity.`);
            const relation = this.metadata.findRelationWithPropertyName(propertyName);
            if (!relation.isManyToMany)
                throw new Error(`Only many-to-many relation supported for this operation. However ${this.metadata.name}#${propertyName} relation type is ${relation.relationType}`);
            const queryRunner = yield this.queryRunnerProvider.provide();
            try {
                const insertPromises = entityIds.map(entityId => {
                    const values = {};
                    if (relation.isOwning) {
                        values[relation.junctionEntityMetadata.columns[0].name] = entityId;
                        values[relation.junctionEntityMetadata.columns[1].name] = relatedEntityId;
                    }
                    else {
                        values[relation.junctionEntityMetadata.columns[1].name] = entityId;
                        values[relation.junctionEntityMetadata.columns[0].name] = relatedEntityId;
                    }
                    return queryRunner.insert(relation.junctionEntityMetadata.table.name, values);
                });
                yield Promise.all(insertPromises);
            }
            finally {
                yield this.queryRunnerProvider.release(queryRunner);
            }
        });
    }
    /**
     * Removes a relation between two entities from relation's many-to-many table.
     * Should be used when you want quickly and efficiently remove a many-to-many relation between two entities.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    removeFromRelation(relationName, entityId, relatedEntityIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const propertyName = this.metadata.computePropertyName(relationName);
            if (!this.metadata.hasRelationWithPropertyName(propertyName))
                throw new Error(`Relation ${propertyName} was not found in the ${this.metadata.name} entity.`);
            const relation = this.metadata.findRelationWithPropertyName(propertyName);
            if (!relation.isManyToMany)
                throw new Error(`Only many-to-many relation supported for this operation. However ${this.metadata.name}#${propertyName} relation type is ${relation.relationType}`);
            // check if given relation entity ids is empty - then nothing to do here (otherwise next code will remove all ids)
            if (!relatedEntityIds || !relatedEntityIds.length)
                return Promise.resolve();
            const qb = this.repository.createQueryBuilder("junctionEntity")
                .delete(relation.junctionEntityMetadata.table.name);
            const firstColumnName = relation.isOwning ? relation.junctionEntityMetadata.columns[0].name : relation.junctionEntityMetadata.columns[1].name;
            const secondColumnName = relation.isOwning ? relation.junctionEntityMetadata.columns[1].name : relation.junctionEntityMetadata.columns[0].name;
            relatedEntityIds.forEach((relatedEntityId, index) => {
                qb.orWhere(`(${firstColumnName}=:entityId AND ${secondColumnName}=:relatedEntity_${index})`)
                    .setParameter("relatedEntity_" + index, relatedEntityId);
            });
            return qb
                .setParameter("entityId", entityId)
                .execute()
                .then(() => { });
        });
    }
    /**
     * Removes a relation between two entities from relation's many-to-many table.
     * Should be used when you want quickly and efficiently remove a many-to-many relation between two entities.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    removeFromInverseRelation(relationName, relatedEntityId, entityIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const propertyName = this.metadata.computePropertyName(relationName);
            if (!this.metadata.hasRelationWithPropertyName(propertyName))
                throw new Error(`Relation ${propertyName} was not found in the ${this.metadata.name} entity.`);
            const relation = this.metadata.findRelationWithPropertyName(propertyName);
            if (!relation.isManyToMany)
                throw new Error(`Only many-to-many relation supported for this operation. However ${this.metadata.name}#${propertyName} relation type is ${relation.relationType}`);
            // check if given entity ids is empty - then nothing to do here (otherwise next code will remove all ids)
            if (!entityIds || !entityIds.length)
                return Promise.resolve();
            const qb = this.repository.createQueryBuilder("junctionEntity")
                .delete(relation.junctionEntityMetadata.table.name);
            const firstColumnName = relation.isOwning ? relation.junctionEntityMetadata.columns[1].name : relation.junctionEntityMetadata.columns[0].name;
            const secondColumnName = relation.isOwning ? relation.junctionEntityMetadata.columns[0].name : relation.junctionEntityMetadata.columns[1].name;
            entityIds.forEach((entityId, index) => {
                qb.orWhere(`(${firstColumnName}=:relatedEntityId AND ${secondColumnName}=:entity_${index})`)
                    .setParameter("entity_" + index, entityId);
            });
            yield qb.setParameter("relatedEntityId", relatedEntityId).execute();
        });
    }
    /**
     * Performs both #addToRelation and #removeFromRelation operations.
     * Should be used when you want quickly and efficiently and and remove a many-to-many relation between two entities.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    addAndRemoveFromRelation(relation, entityId, addRelatedEntityIds, removeRelatedEntityIds) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([
                this.addToRelation(relation, entityId, addRelatedEntityIds),
                this.removeFromRelation(relation, entityId, removeRelatedEntityIds)
            ]);
        });
    }
    /**
     * Performs both #addToRelation and #removeFromRelation operations.
     * Should be used when you want quickly and efficiently and and remove a many-to-many relation between two entities.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    addAndRemoveFromInverseRelation(relation, relatedEntityId, addEntityIds, removeEntityIds) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([
                this.addToInverseRelation(relation, relatedEntityId, addEntityIds),
                this.removeFromInverseRelation(relation, relatedEntityId, removeEntityIds)
            ]);
        });
    }
    /**
     * Removes entity with the given id.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    removeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const alias = this.metadata.table.name;
            const parameters = {};
            let condition = "";
            if (this.metadata.hasMultiplePrimaryKeys) {
                condition = this.metadata.primaryColumns.map(primaryColumn => {
                    parameters[primaryColumn.propertyName] = id[primaryColumn.propertyName];
                    return alias + "." + primaryColumn.propertyName + "=:" + primaryColumn.propertyName;
                }).join(" AND ");
            }
            else {
                condition = alias + "." + this.metadata.firstPrimaryColumn.propertyName + "=:id";
                parameters["id"] = id;
            }
            yield this.repository.createQueryBuilder(alias)
                .delete()
                .where(condition, parameters)
                .execute();
        });
    }
    /**
     * Removes all entities with the given ids.
     * Note that event listeners and event subscribers won't work (and will not send any events) when using this operation.
     */
    removeByIds(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const alias = this.metadata.table.name;
            const parameters = {};
            let condition = "";
            if (this.metadata.hasMultiplePrimaryKeys) {
                condition = ids.map((id, idIndex) => {
                    this.metadata.primaryColumns.map(primaryColumn => {
                        parameters[primaryColumn.propertyName + "_" + idIndex] = id[primaryColumn.propertyName];
                        return alias + "." + primaryColumn.propertyName + "=:" + primaryColumn.propertyName + "_" + idIndex;
                    }).join(" AND ");
                }).join(" OR ");
            }
            else {
                condition = alias + "." + this.metadata.firstPrimaryColumn.propertyName + " IN (:ids)";
                parameters["ids"] = ids;
            }
            yield this.repository.createQueryBuilder(alias)
                .delete()
                .where(condition, parameters)
                .execute();
        });
    }
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Extracts unique objects from given entity and all its downside relations.
     */
    extractObjectsById(entity, metadata, entityWithIds = []) {
        const promises = metadata.relations.map(relation => {
            const relMetadata = relation.inverseEntityMetadata;
            const value = relation.isLazy ? entity["__" + relation.propertyName + "__"] : entity[relation.propertyName];
            if (!value)
                return undefined;
            if (value instanceof Array) {
                const subPromises = value.map((subEntity) => {
                    return this.extractObjectsById(subEntity, relMetadata, entityWithIds);
                });
                return Promise.all(subPromises);
            }
            else {
                return this.extractObjectsById(value, relMetadata, entityWithIds);
            }
        });
        return Promise.all(promises.filter(result => !!result)).then(() => {
            if (!entityWithIds.find(entityWithId => entityWithId.entity === entity)) {
                const entityWithId = new OperateEntity(metadata, entity);
                entityWithIds.push(entityWithId);
            }
            return entityWithIds;
        });
    }
}
//# sourceMappingURL=SpecificRepository.js.map