var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { OperateEntity } from "./operation/PersistOperation";
import { QueryBuilder } from "../query-builder/QueryBuilder";
import { PlainObjectToDatabaseEntityTransformer } from "../query-builder/transformer/PlainObjectToDatabaseEntityTransformer";
import { EntityPersistOperationBuilder } from "./EntityPersistOperationsBuilder";
import { PersistOperationExecutor } from "./PersistOperationExecutor";
/**
 * Manages entity persistence - insert, update and remove of entity.
 */
export class EntityPersister {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(connection, metadata, queryRunner) {
        this.connection = connection;
        this.metadata = metadata;
        this.queryRunner = queryRunner;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Persists given entity in the database.
     */
    persist(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const allNewEntities = yield this.flattenEntityRelationTree(entity, this.metadata);
            const persistedEntity = allNewEntities.find(operatedEntity => operatedEntity.entity === entity);
            if (!persistedEntity)
                throw new Error(`Internal error. Persisted entity was not found in the list of prepared operated entities`);
            let dbEntity, allDbInNewEntities = [];
            // if entity has an id then check
            if (this.hasId(entity)) {
                const queryBuilder = new QueryBuilder(this.connection, this.queryRunner)
                    .select(this.metadata.table.name)
                    .from(this.metadata.target, this.metadata.table.name);
                const plainObjectToDatabaseEntityTransformer = new PlainObjectToDatabaseEntityTransformer();
                const loadedDbEntity = yield plainObjectToDatabaseEntityTransformer.transform(entity, this.metadata, queryBuilder);
                if (loadedDbEntity) {
                    dbEntity = new OperateEntity(this.metadata, loadedDbEntity);
                    allDbInNewEntities = yield this.flattenEntityRelationTree(loadedDbEntity, this.metadata);
                }
            }
            // need to find db entities that were not loaded by initialize method
            const allDbEntities = yield this.findNotLoadedIds(allNewEntities, allDbInNewEntities);
            const entityPersistOperationBuilder = new EntityPersistOperationBuilder(this.connection.entityMetadatas);
            const persistOperation = entityPersistOperationBuilder.buildFullPersistment(dbEntity, persistedEntity, allDbEntities, allNewEntities);
            const persistOperationExecutor = new PersistOperationExecutor(this.connection.driver, this.connection.entityMetadatas, this.connection.broadcaster, this.queryRunner); // todo: better to pass connection?
            yield persistOperationExecutor.executePersistOperation(persistOperation);
            return entity;
        });
    }
    /**
     * Removes given entity from the database.
     */
    remove(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryBuilder = new QueryBuilder(this.connection, this.queryRunner)
                .select(this.metadata.table.name)
                .from(this.metadata.target, this.metadata.table.name);
            const plainObjectToDatabaseEntityTransformer = new PlainObjectToDatabaseEntityTransformer();
            const dbEntity = yield plainObjectToDatabaseEntityTransformer.transform(entity, this.metadata, queryBuilder);
            this.metadata.primaryColumnsWithParentPrimaryColumns.forEach(primaryColumn => entity[primaryColumn.propertyName] = undefined);
            const dbEntities = this.flattenEntityRelationTree(dbEntity, this.metadata);
            const allPersistedEntities = this.flattenEntityRelationTree(entity, this.metadata);
            const entityWithId = new OperateEntity(this.metadata, entity);
            const dbEntityWithId = new OperateEntity(this.metadata, dbEntity);
            const entityPersistOperationBuilder = new EntityPersistOperationBuilder(this.connection.entityMetadatas);
            const persistOperation = entityPersistOperationBuilder.buildOnlyRemovement(this.metadata, dbEntityWithId, entityWithId, dbEntities, allPersistedEntities);
            const persistOperationExecutor = new PersistOperationExecutor(this.connection.driver, this.connection.entityMetadatas, this.connection.broadcaster, this.queryRunner); // todo: better to pass connection?
            yield persistOperationExecutor.executePersistOperation(persistOperation);
            return entity;
        });
    }
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * todo: multiple implementations of hasId: here, in repository, in entity metadata
     */
    hasId(entity) {
        return this.metadata.primaryColumns.every(primaryColumn => {
            const columnName = primaryColumn.propertyName;
            return !!entity &&
                entity.hasOwnProperty(columnName) &&
                entity[columnName] !== null &&
                entity[columnName] !== undefined &&
                entity[columnName] !== "";
        });
    }
    /**
     * When ORM loads dbEntity it uses joins to load all entity dependencies. However when dbEntity is newly persisted
     * to the db, but uses already exist in the db relational entities, those entities cannot be loaded, and will
     * absent in dbEntities. To fix it, we need to go throw all persistedEntities we have, find out those which have
     * ids, check if we did not load them yet and try to load them. This algorithm will make sure that all dbEntities
     * are loaded. Further it will help insert operations to work correctly.
     */
    findNotLoadedIds(persistedEntities, dbEntities) {
        return __awaiter(this, void 0, void 0, function* () {
            const newDbEntities = dbEntities ? dbEntities.map(dbEntity => dbEntity) : [];
            const missingDbEntitiesLoad = persistedEntities.map((entityWithId) => __awaiter(this, void 0, void 0, function* () {
                if (entityWithId.id === null || // todo: not sure if this condition will work
                    entityWithId.id === undefined || // todo: not sure if this condition will work
                    newDbEntities.find(dbEntity => dbEntity.entityTarget === entityWithId.entityTarget && dbEntity.compareId(entityWithId.id)))
                    return;
                const alias = entityWithId.entityTarget.name; // todo: this won't work if target is string
                const parameters = {};
                let condition = "";
                const metadata = this.connection.entityMetadatas.findByTarget(entityWithId.entityTarget);
                if (metadata.hasParentIdColumn) {
                    condition = metadata.parentIdColumns.map(parentIdColumn => {
                        parameters[parentIdColumn.propertyName] = entityWithId.id[parentIdColumn.propertyName];
                        return alias + "." + parentIdColumn.propertyName + "=:" + parentIdColumn.propertyName;
                    }).join(" AND ");
                }
                else {
                    condition = metadata.primaryColumns.map(primaryColumn => {
                        parameters[primaryColumn.propertyName] = entityWithId.id[primaryColumn.propertyName];
                        return alias + "." + primaryColumn.propertyName + "=:" + primaryColumn.propertyName;
                    }).join(" AND ");
                }
                const loadedEntity = yield new QueryBuilder(this.connection, this.queryRunner)
                    .select(alias)
                    .from(entityWithId.entityTarget, alias)
                    .where(condition, parameters)
                    .getSingleResult();
                if (loadedEntity)
                    newDbEntities.push(new OperateEntity(metadata, loadedEntity));
            }));
            yield Promise.all(missingDbEntitiesLoad);
            return newDbEntities;
        });
    }
    /**
     * Extracts unique entities from given entity and all its downside relations.
     */
    flattenEntityRelationTree(entity, metadata) {
        const operateEntities = [];
        const recursive = (entity, metadata) => {
            operateEntities.push(new OperateEntity(metadata, entity));
            metadata.extractRelationValuesFromEntity(entity, metadata.relations)
                .filter(([relation, value]) => !operateEntities.find(operateEntity => operateEntity.entity === value)) // exclude duplicate entities and avoid recursion
                .forEach(([relation, value]) => recursive(value, relation.inverseEntityMetadata));
        };
        recursive(entity, metadata);
        return operateEntities;
    }
}
//# sourceMappingURL=EntityPersister.js.map