import { PersistOperation } from "./operation/PersistOperation";
import { Broadcaster } from "../subscriber/Broadcaster";
import { EntityMetadataCollection } from "../metadata-args/collection/EntityMetadataCollection";
import { Driver } from "../driver/Driver";
import { QueryRunner } from "../query-runner/QueryRunner";
/**
 * Executes PersistOperation in the given connection.
 */
export declare class PersistOperationExecutor {
    private driver;
    private entityMetadatas;
    private broadcaster;
    private queryRunner;
    constructor(driver: Driver, entityMetadatas: EntityMetadataCollection, broadcaster: Broadcaster, queryRunner: QueryRunner);
    /**
     * Executes given persist operation.
     */
    executePersistOperation(persistOperation: PersistOperation): Promise<void[]>;
    /**
     * Broadcast all before persistment events - beforeInsert, beforeUpdate and beforeRemove events.
     */
    private broadcastBeforeEvents(persistOperation);
    /**
     * Broadcast all after persistment events - afterInsert, afterUpdate and afterRemove events.
     */
    private broadcastAfterEvents(persistOperation);
    /**
     * Executes insert operations.
     */
    private executeInsertOperations(persistOperation);
    /**
     * Executes insert operations for closure tables.
     */
    private executeInsertClosureTableOperations(persistOperation);
    /**
     * Executes update tree level operations in inserted entities right after data into closure table inserted.
     */
    private executeUpdateTreeLevelOperations(persistOperation);
    /**
     * Executes insert junction operations.
     */
    private executeInsertJunctionsOperations(persistOperation);
    /**
     * Executes remove junction operations.
     */
    private executeRemoveJunctionsOperations(persistOperation);
    /**
     * Executes update relations operations.
     */
    private executeUpdateRelationsOperations(persistOperation);
    /**
     * Executes update relations operations.
     */
    private executeUpdateInverseRelationsOperations(persistOperation);
    /**
     * Executes update operations.
     */
    private executeUpdateOperations(persistOperation);
    /**
     * Executes remove relations operations.
     */
    private executeRemoveRelationOperations(persistOperation);
    /**
     * Executes remove operations.
     */
    private executeRemoveOperations(persistOperation);
    /**
     * Updates all ids of the inserted entities.
     */
    private updateIdsOfInsertedEntities(persistOperation);
    /**
     * Updates all special columns of the saving entities (create date, update date, versioning).
     */
    private updateSpecialColumnsInEntities(persistOperation);
    /**
     * Removes all ids of the removed entities.
     */
    private updateIdsOfRemovedEntities(persistOperation);
    private findUpdateOperationForEntity(operations, insertOperations, target);
    private updateByRelation(operation, insertOperations);
    private updateInverseRelation(operation, insertOperations);
    private update(updateOperation);
    private updateDeletedRelations(removeOperation);
    private delete(target, entity);
    /**
     * Inserts an entity from the given insert operation into the database.
     * If entity has an generated column, then after saving new generated value will be stored to the InsertOperation.
     * If entity uses class-table-inheritance, then multiple inserts may by performed to save all entities.
     */
    private insert(operation);
    private collectColumnsAndValues(metadata, entity, date, parentIdColumnValue?, discriminatorValue?);
    private insertIntoClosureTable(operation, updateMap);
    private updateTreeLevel(operation);
    private insertJunctions(junctionOperation, insertOperations);
    private removeJunctions(junctionOperation);
    private zipObject(keys, values);
    private getEntityRelationValue(relation, entity);
}
