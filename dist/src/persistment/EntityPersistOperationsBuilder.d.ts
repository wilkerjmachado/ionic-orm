import { EntityMetadata } from "../metadata/EntityMetadata";
import { PersistOperation, OperateEntity } from "./operation/PersistOperation";
import { EntityMetadataCollection } from "../metadata-args/collection/EntityMetadataCollection";
/**
 * 1. collect all exist objects from the db entity
 * 2. collect all objects from the new entity
 * 3. first need to go throw all relations of the new entity and:
 *      3.1. find all objects that are new (e.g. cascade="insert") by comparing ids from the exist objects
 *      3.2. check if relation has rights to do cascade operation and throw exception if it cannot
 *      3.3. save new objects for insert operation
 * 4. second need to go throw all relations of the db entity and:
 *      4.1. find all objects that are removed (e.g. cascade="remove") by comparing data with collected objects of the new entity
 *      4.2. check if relation has rights to do cascade operation and throw exception if it cannot
 *      4.3. save new objects for remove operation
 * 5. third need to go throw collection of all new entities
 *      5.1. compare with entities from the collection of db entities, find difference and generate a change set
 *      5.2. check if relation has rights to do cascade operation and throw exception if it cannot
 *      5.3.
 * 6. go throw all relations and find junction
 *      6.1.
 *
 * if relation has "all" then all of above:
 * if relation has "insert" it can insert a new entity
 * if relation has "update" it can only update related entity
 * if relation has "remove" it can only remove related entity
 */
export declare class EntityPersistOperationBuilder {
    private entityMetadatas;
    private strictCascadesMode;
    constructor(entityMetadatas: EntityMetadataCollection);
    /**
     * Finds columns and relations from entity2 which does not exist or does not match in entity1.
     */
    buildFullPersistment(dbEntity: OperateEntity | undefined, persistedEntity: OperateEntity, dbEntities: OperateEntity[], allPersistedEntities: OperateEntity[]): PersistOperation;
    /**
     * Finds columns and relations from entity2 which does not exist or does not match in entity1.
     */
    buildOnlyRemovement(metadata: EntityMetadata, dbEntity: OperateEntity, persistedEntity: OperateEntity, dbEntities: OperateEntity[], allPersistedEntities: OperateEntity[]): PersistOperation;
    private findCascadeInsertedEntities(newEntityWithId, dbEntities, fromRelation?, operations?);
    private findCascadeUpdateEntities(updatesByRelations, metadata, dbEntityWithId, newEntityWithId, dbEntities, fromRelation?, operations?);
    private findCascadeRemovedEntities(metadata, dbEntityWithId, allPersistedEntities, fromRelation, fromMetadata, fromEntityId, parentAlreadyRemoved?);
    private updateInverseRelations(metadata, dbOperateEntity, newOperateEntity, operations?);
    /**
     * To update relation, you need:
     *   update table where this relation (owner side)
     *   set its relation property to inserted id
     *   where
     *
     */
    private updateRelations(insertOperations, newEntity);
    private findRelationsWithEntityInside(insertOperation, entityToSearchInWithId);
    private findJunctionInsertOperations(metadata, newEntityWithId, dbEntities, isRoot?);
    private findJunctionRemoveOperations(metadata, dbEntityWithId, newEntities, isRoot?);
    private diffColumns(metadata, newEntity, dbEntity);
    private diffRelations(updatesByRelations, metadata, newEntity, dbEntity);
    private findEntityWithId(entityWithIds, entityTarget, id);
    private checkCascadesAllowed(type, metadata, relation);
    private getEntityRelationValue(relation, entity);
}
