import { EntitySubscriberInterface } from "./EntitySubscriberInterface";
import { ColumnMetadata } from "../metadata/ColumnMetadata";
import { EntityListenerMetadata } from "../metadata/EntityListenerMetadata";
import { EntityMetadataCollection } from "../metadata-args/collection/EntityMetadataCollection";
import { ObjectLiteral } from "../common/ObjectLiteral";
/**
 * Broadcaster provides a helper methods to broadcast events to the subscribers.
 */
export declare class Broadcaster {
    private entityMetadatas;
    private subscriberMetadatas;
    private entityListeners;
    constructor(entityMetadatas: EntityMetadataCollection, subscriberMetadatas: EntitySubscriberInterface<any>[], entityListeners: EntityListenerMetadata[]);
    /**
     * Broadcasts "BEFORE_INSERT" event.
     * Before insert event is executed before entity is being inserted to the database for the first time.
     * All subscribers and entity listeners who listened to this event will be executed at this point.
     * Subscribers and entity listeners can return promises, it will wait until they are resolved.
     */
    broadcastBeforeInsertEvent(entity: ObjectLiteral): Promise<void>;
    /**
     * Broadcasts "BEFORE_UPDATE" event.
     * Before update event is executed before entity is being updated in the database.
     * All subscribers and entity listeners who listened to this event will be executed at this point.
     * Subscribers and entity listeners can return promises, it will wait until they are resolved.
     */
    broadcastBeforeUpdateEvent(entity: ObjectLiteral, updatedColumns: ColumnMetadata[]): Promise<void>;
    /**
     * Broadcasts "BEFORE_REMOVE" event.
     * Before remove event is executed before entity is being removed from the database.
     * All subscribers and entity listeners who listened to this event will be executed at this point.
     * Subscribers and entity listeners can return promises, it will wait until they are resolved.
     */
    broadcastBeforeRemoveEvent(entity: ObjectLiteral, entityId: any): Promise<void>;
    /**
     * Broadcasts "AFTER_INSERT" event.
     * After insert event is executed after entity is being persisted to the database for the first time.
     * All subscribers and entity listeners who listened to this event will be executed at this point.
     * Subscribers and entity listeners can return promises, it will wait until they are resolved.
     */
    broadcastAfterInsertEvent(entity: ObjectLiteral): Promise<void>;
    /**
     * Broadcasts "AFTER_UPDATE" event.
     * After update event is executed after entity is being updated in the database.
     * All subscribers and entity listeners who listened to this event will be executed at this point.
     * Subscribers and entity listeners can return promises, it will wait until they are resolved.
     */
    broadcastAfterUpdateEvent(entity: ObjectLiteral, updatedColumns: ColumnMetadata[]): Promise<void>;
    /**
     * Broadcasts "AFTER_REMOVE" event.
     * After remove event is executed after entity is being removed from the database.
     * All subscribers and entity listeners who listened to this event will be executed at this point.
     * Subscribers and entity listeners can return promises, it will wait until they are resolved.
     */
    broadcastAfterRemoveEvent(entity: ObjectLiteral, entityId: any): Promise<void>;
    /**
     * Broadcasts "AFTER_LOAD" event for all given entities, and their sub-entities.
     * After load event is executed after entity has been loaded from the database.
     * All subscribers and entity listeners who listened to this event will be executed at this point.
     * Subscribers and entity listeners can return promises, it will wait until they are resolved.
     */
    broadcastLoadEventsForAll(target: Function | string, entities: any[]): Promise<void>;
    /**
     * Broadcasts "AFTER_LOAD" event for the given entity and all its sub-entities.
     * After load event is executed after entity has been loaded from the database.
     * All subscribers and entity listeners who listened to this event will be executed at this point.
     * Subscribers and entity listeners can return promises, it will wait until they are resolved.
     */
    broadcastLoadEvents(target: Function | string, entity: any): Promise<void>;
    /**
     * Checks if entity listener is allowed to be executed on the given entity.
     */
    protected isAllowedListener(listener: EntityListenerMetadata, entity: ObjectLiteral): boolean;
    /**
     * Checks if subscriber's methods can be executed by checking if its don't listen to the particular entity,
     * or listens our entity.
     */
    protected isAllowedSubscriber(subscriber: EntitySubscriberInterface<any>, entity: ObjectLiteral): boolean;
}
