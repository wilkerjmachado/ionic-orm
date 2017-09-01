import { EntityMetadata } from "../metadata/EntityMetadata";
import { OperateEntity } from "./operation/PersistOperation";
import { ObjectLiteral } from "../common/ObjectLiteral";
import { Connection } from "../connection/Connection";
import { QueryRunner } from "../query-runner/QueryRunner";
/**
 * Manages entity persistence - insert, update and remove of entity.
 */
export declare class EntityPersister<Entity extends ObjectLiteral> {
    protected connection: Connection;
    protected metadata: EntityMetadata;
    protected queryRunner: QueryRunner;
    constructor(connection: Connection, metadata: EntityMetadata, queryRunner: QueryRunner);
    /**
     * Persists given entity in the database.
     */
    persist(entity: Entity): Promise<Entity>;
    /**
     * Removes given entity from the database.
     */
    remove(entity: Entity): Promise<Entity>;
    /**
     * todo: multiple implementations of hasId: here, in repository, in entity metadata
     */
    protected hasId(entity: Entity): boolean;
    /**
     * When ORM loads dbEntity it uses joins to load all entity dependencies. However when dbEntity is newly persisted
     * to the db, but uses already exist in the db relational entities, those entities cannot be loaded, and will
     * absent in dbEntities. To fix it, we need to go throw all persistedEntities we have, find out those which have
     * ids, check if we did not load them yet and try to load them. This algorithm will make sure that all dbEntities
     * are loaded. Further it will help insert operations to work correctly.
     */
    protected findNotLoadedIds(persistedEntities: OperateEntity[], dbEntities?: OperateEntity[]): Promise<OperateEntity[]>;
    /**
     * Extracts unique entities from given entity and all its downside relations.
     */
    protected flattenEntityRelationTree(entity: Entity, metadata: EntityMetadata): OperateEntity[];
}
