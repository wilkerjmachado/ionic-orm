import { Driver } from "../driver/Driver";
import { ObjectType } from "../common/ObjectType";
import { EntityMetadataCollection } from "../metadata-args/collection/EntityMetadataCollection";
import { NamingStrategyInterface } from "../naming-strategy/NamingStrategyInterface";
import { Broadcaster } from "../subscriber/Broadcaster";
import { LazyRelationsWrapper } from "../lazy-loading/LazyRelationsWrapper";
import { EntityMetadata } from "../metadata/EntityMetadata";
import { SchemaBuilder } from "../schema-builder/SchemaBuilder";
import { Logger } from "../logger/Logger";
import { EntityManager } from "../entity-manager/EntityManager";
import { RepositoryAggregator } from "../repository/RepositoryAggregator";
import { EntitySchema } from "../entity-schema/EntitySchema";
import { Repository } from "../repository/Repository";
import { TreeRepository } from "../repository/TreeRepository";
import { SpecificRepository } from "../repository/SpecificRepository";
/**
 * Connection is a single database connection to a specific database of a database management system.
 * You can have multiple connections to multiple databases in your application.
 */
export declare class Connection {
    /**
     * Connection name.
     */
    readonly name: string;
    /**
     * Database driver used by this connection.
     */
    readonly driver: Driver;
    /**
     * Logger used to log orm events.
     */
    readonly logger: Logger;
    /**
     * All entity metadatas that are registered for this connection.
     */
    readonly entityMetadatas: EntityMetadataCollection;
    /**
     * Used to broadcast connection events.
     */
    readonly broadcaster: Broadcaster;
    /**
     * Gets EntityManager of this connection.
     */
    private readonly _entityManager;
    /**
     * Stores all registered repositories.
     */
    private readonly repositoryAggregators;
    /**
     * Entity listeners that are registered for this connection.
     */
    private readonly entityListeners;
    /**
     * Entity subscribers that are registered for this connection.
     */
    private readonly entitySubscribers;
    /**
     * Registered entity classes to be used for this connection.
     */
    private readonly entityClasses;
    /**
     * Registered entity schemas to be used for this connection.
     */
    private readonly entitySchemas;
    /**
     * Registered subscriber classes to be used for this connection.
     */
    private readonly subscriberClasses;
    /**
     * Registered naming strategy classes to be used for this connection.
     */
    private readonly namingStrategyClasses;
    /**
     * Naming strategy to be used in this connection.
     */
    private usedNamingStrategy;
    /**
     * Indicates if connection has been done or not.
     */
    private _isConnected;
    constructor(name: string, driver: Driver, logger: Logger);
    /**
     * Indicates if connection to the database already established for this connection.
     */
    readonly isConnected: boolean;
    /**
     * Gets entity manager that allows to perform repository operations with any entity in this connection.
     */
    /**
     * Performs connection to the database.
     */
    connect(): Promise<this>;
    /**
     * Closes connection with the database.
     * Once connection is closed, you cannot use repositories and perform any operations except
     * opening connection again.
     */
    close(): Promise<void>;
    /**
     * Drops the database and all its data.
     */
    dropDatabase(): Promise<void>;
    /**
     * Creates database schema for all entities registered in this connection.
     *
     * @param dropBeforeSync If set to true then it drops the database with all its tables and data
     */
    syncSchema(dropBeforeSync?: boolean): Promise<void>;
    /**
     * Imports entities from the given paths (directories) and registers them in the current connection.
     */
    /**
     * Imports entities and registers them in the current connection.
     */
    importEntities(entities: Function[]): this;
    /**
     * Imports schemas and registers them in the current connection.
     */
    importEntitySchemas(schemas: EntitySchema[]): this;
    /**
     * Imports subscribers and registers them in the current connection.
     */
    importSubscribers(subscriberClasses: Function[]): this;
    /**
     * Imports naming strategies and registers them in the current connection.
     */
    importNamingStrategies(strategies: Function[]): this;
    /**
     * Sets given naming strategy to be used.
     * Naming strategy must be set to be used before connection is established.
     */
    useNamingStrategy(name: string): this;
    /**
     * Sets given naming strategy to be used.
     * Naming strategy must be set to be used before connection is established.
     */
    useNamingStrategy(strategy: Function): this;
    /**
     * Gets the entity metadata of the given entity class.
     */
    getMetadata(entity: Function): EntityMetadata;
    /**
     * Gets the entity metadata of the given entity name.
     */
    getMetadata(entity: string): EntityMetadata;
    /**
     * Gets repository for the given entity class.
     */
    getRepository<Entity>(entityClass: ObjectType<Entity>): Repository<Entity>;
    /**
     * Gets repository for the given entity name.
     */
    getRepository<Entity>(entityName: string): Repository<Entity>;
    /**
     * Gets tree repository for the given entity class.
     * Only tree-type entities can have a TreeRepository,
     * like ones decorated with @ClosureTable decorator.
     */
    getTreeRepository<Entity>(entityClass: ObjectType<Entity>): TreeRepository<Entity>;
    /**
     * Gets tree repository for the given entity class.
     * Only tree-type entities can have a TreeRepository,
     * like ones decorated with @ClosureTable decorator.
     */
    getTreeRepository<Entity>(entityName: string): TreeRepository<Entity>;
    /**
     * Gets specific repository for the given entity class.
     * SpecificRepository is a special repository that contains specific and non standard repository methods.
     */
    getSpecificRepository<Entity>(entityClass: ObjectType<Entity>): SpecificRepository<Entity>;
    /**
     * Gets specific repository for the given entity name.
     * SpecificRepository is a special repository that contains specific and non standard repository methods.
     */
    getSpecificRepository<Entity>(entityName: string): SpecificRepository<Entity>;
    /**
     * Creates a new entity manager with a single opened connection to the database.
     * This may be useful if you want to perform all db queries within one connection.
     * After finishing with entity manager, don't forget to release it, to release connection back to pool.
     */
    createEntityManagerWithSingleDatabaseConnection(): EntityManager;
    /**
     * Finds repository aggregator of the given entity class or name.
     */
    protected findRepositoryAggregator(entityClassOrName: ObjectType<any> | string): RepositoryAggregator;
    /**
     * Builds all registered metadatas.
     */
    protected buildMetadatas(): void;
    /**
     * Creates a naming strategy to be used for this connection.
     */
    protected createNamingStrategy(): NamingStrategyInterface;
    /**
     * Creates a new default entity manager without single connection setup.
     */
    protected createEntityManager(): EntityManager;
    /**
     * Creates a new entity broadcaster using in this connection.
     */
    protected createBroadcaster(): Broadcaster;
    /**
     * Creates a schema builder used to build a database schema for the entities of the current connection.
     */
    protected createSchemaBuilder(): SchemaBuilder;
    /**
     * Creates a lazy relations wrapper.
     */
    protected createLazyRelationsWrapper(): LazyRelationsWrapper;
}
