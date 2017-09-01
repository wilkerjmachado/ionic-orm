var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { RepositoryNotFoundError } from "./error/RepositoryNotFoundError";
import { EntityListenerMetadata } from "../metadata/EntityListenerMetadata";
// import {EntityManager} from "../entity-manager/EntityManager";
// import {importClassesFromDirectories, importJsonsFromDirectories} from "../util/DirectoryExportedClassesLoader";
import { getFromContainer } from "../container";
import { getMetadataArgsStorage } from "../../index";
import { EntityMetadataBuilder } from "../metadata-builder/EntityMetadataBuilder";
import { DefaultNamingStrategy } from "../naming-strategy/DefaultNamingStrategy";
import { EntityMetadataCollection } from "../metadata-args/collection/EntityMetadataCollection";
import { NoConnectionForRepositoryError } from "./error/NoConnectionForRepositoryError";
import { CannotImportAlreadyConnectedError } from "./error/CannotImportAlreadyConnectedError";
import { CannotCloseNotConnectedError } from "./error/CannotCloseNotConnectedError";
import { CannotConnectAlreadyConnectedError } from "./error/CannotConnectAlreadyConnectedError";
import { NamingStrategyNotFoundError } from "./error/NamingStrategyNotFoundError";
import { RepositoryNotTreeError } from "./error/RepositoryNotTreeError";
// import {EntitySchema} from "../entity-schema/EntitySchema";
import { CannotSyncNotConnectedError } from "./error/CannotSyncNotConnectedError";
import { CannotUseNamingStrategyNotConnectedError } from "./error/CannotUseNamingStrategyNotConnectedError";
import { Broadcaster } from "../subscriber/Broadcaster";
import { LazyRelationsWrapper } from "../lazy-loading/LazyRelationsWrapper";
import { SchemaBuilder } from "../schema-builder/SchemaBuilder";
import { EntityManager } from "../entity-manager/EntityManager";
import { RepositoryAggregator } from "../repository/RepositoryAggregator";
import { QueryRunnerProvider } from "../query-runner/QueryRunnerProvider";
// import {QueryRunnerProvider} from "../query-runner/QueryRunnerProvider";
/**
 * Connection is a single database connection to a specific database of a database management system.
 * You can have multiple connections to multiple databases in your application.
 */
export class Connection {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(name, driver, logger) {
        /**
         * All entity metadatas that are registered for this connection.
         */
        this.entityMetadatas = new EntityMetadataCollection();
        /**
         * Stores all registered repositories.
         */
        this.repositoryAggregators = [];
        /**
         * Entity listeners that are registered for this connection.
         */
        this.entityListeners = [];
        /**
         * Entity subscribers that are registered for this connection.
         */
        this.entitySubscribers = [];
        /**
         * Registered entity classes to be used for this connection.
         */
        this.entityClasses = [];
        /**
         * Registered entity schemas to be used for this connection.
         */
        this.entitySchemas = [];
        /**
         * Registered subscriber classes to be used for this connection.
         */
        this.subscriberClasses = [];
        /**
         * Registered naming strategy classes to be used for this connection.
         */
        this.namingStrategyClasses = [];
        /**
         * Indicates if connection has been done or not.
         */
        this._isConnected = false;
        this.name = name;
        this.driver = driver;
        this.logger = logger;
        this._entityManager = this.createEntityManager();
        this.broadcaster = this.createBroadcaster();
    }
    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------
    /**
     * Indicates if connection to the database already established for this connection.
     */
    get isConnected() {
        return this._isConnected;
    }
    /**
     * Gets entity manager that allows to perform repository operations with any entity in this connection.
     */
    /*get entityManager() {
        if (!this.isConnected)
            throw new CannotGetEntityManagerNotConnectedError(this.name);
        
        return this._entityManager;
    }*/
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Performs connection to the database.
     */
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isConnected)
                throw new CannotConnectAlreadyConnectedError(this.name);
            // connect to the database via its driver
            yield this.driver.connect();
            // build all metadatas registered in the current connection
            this.buildMetadatas();
            // set connected status for the current connection
            this._isConnected = true;
            return this;
        });
    }
    /**
     * Closes connection with the database.
     * Once connection is closed, you cannot use repositories and perform any operations except
     * opening connection again.
     */
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isConnected)
                throw new CannotCloseNotConnectedError(this.name);
            yield this.driver.disconnect();
            this._isConnected = false;
        });
    }
    /**
     * Drops the database and all its data.
     */
    dropDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            const queryRunner = yield this.driver.createQueryRunner();
            yield queryRunner.beginTransaction();
            try {
                yield queryRunner.clearDatabase();
                yield queryRunner.commitTransaction();
                yield queryRunner.release();
            }
            catch (error) {
                yield queryRunner.rollbackTransaction();
                yield queryRunner.release();
                throw error;
            }
        });
    }
    /**
     * Creates database schema for all entities registered in this connection.
     *
     * @param dropBeforeSync If set to true then it drops the database with all its tables and data
     */
    syncSchema(dropBeforeSync = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isConnected)
                return Promise.reject(new CannotSyncNotConnectedError(this.name));
            if (dropBeforeSync)
                yield this.dropDatabase();
            yield this.createSchemaBuilder().build();
        });
    }
    /**
     * Imports entities from the given paths (directories) and registers them in the current connection.
     */
    /*importEntitiesFromDirectories(paths: string[]): this {
        this.importEntities(importClassesFromDirectories(paths));
        return this;
    }

    /!**
     * Imports entity schemas from the given paths (directories) and registers them in the current connection.
     *!/
    importEntitySchemaFromDirectories(paths: string[]): this {
        this.importEntitySchemas(importJsonsFromDirectories(paths));
        return this;
    }

    /!**
     * Imports subscribers from the given paths (directories) and registers them in the current connection.
     *!/
    importSubscribersFromDirectories(paths: string[]): this {
        this.importSubscribers(importClassesFromDirectories(paths));
        return this;
    }

    /!**
     * Imports naming strategies from the given paths (directories) and registers them in the current connection.
     *!/
    importNamingStrategiesFromDirectories(paths: string[]): this {
        this.importEntities(importClassesFromDirectories(paths));
        return this;
    }*/
    /**
     * Imports entities and registers them in the current connection.
     */
    importEntities(entities) {
        if (this.isConnected)
            throw new CannotImportAlreadyConnectedError("entities", this.name);
        entities.forEach(cls => this.entityClasses.push(cls));
        return this;
    }
    /**
     * Imports schemas and registers them in the current connection.
     */
    importEntitySchemas(schemas) {
        if (this.isConnected)
            throw new CannotImportAlreadyConnectedError("schemas", this.name);
        schemas.forEach(schema => this.entitySchemas.push(schema));
        return this;
    }
    /**
     * Imports subscribers and registers them in the current connection.
     */
    importSubscribers(subscriberClasses) {
        if (this.isConnected)
            throw new CannotImportAlreadyConnectedError("entity subscribers", this.name);
        subscriberClasses.forEach(cls => this.subscriberClasses.push(cls));
        return this;
    }
    /**
     * Imports naming strategies and registers them in the current connection.
     */
    importNamingStrategies(strategies) {
        if (this.isConnected)
            throw new CannotImportAlreadyConnectedError("naming strategies", this.name);
        strategies.forEach(cls => this.namingStrategyClasses.push(cls));
        return this;
    }
    /**
     * Sets given naming strategy to be used.
     * Naming strategy must be set to be used before connection is established.
     */
    useNamingStrategy(strategyClassOrName) {
        if (this.isConnected)
            throw new CannotUseNamingStrategyNotConnectedError(this.name);
        this.usedNamingStrategy = strategyClassOrName;
        return this;
    }
    /**
     Gets entity metadata for the given entity class or schema name.
     */
    getMetadata(entity) {
        return this.entityMetadatas.findByTarget(entity);
    }
    /**
     * Gets repository for the given entity class or name.
     */
    getRepository(entityClassOrName) {
        return this.findRepositoryAggregator(entityClassOrName).repository;
    }
    /**
     * Gets tree repository for the given entity class or name.
     * Only tree-type entities can have a TreeRepository,
     * like ones decorated with @ClosureTable decorator.
     */
    getTreeRepository(entityClassOrName) {
        const repository = this.findRepositoryAggregator(entityClassOrName).treeRepository;
        if (!repository)
            throw new RepositoryNotTreeError(entityClassOrName);
        return repository;
    }
    /**
     * Gets specific repository for the given entity class or name.
     * SpecificRepository is a special repository that contains specific and non standard repository methods.
     */
    getSpecificRepository(entityClassOrName) {
        return this.findRepositoryAggregator(entityClassOrName).specificRepository;
    }
    /**
     * Creates a new entity manager with a single opened connection to the database.
     * This may be useful if you want to perform all db queries within one connection.
     * After finishing with entity manager, don't forget to release it, to release connection back to pool.
     */
    createEntityManagerWithSingleDatabaseConnection() {
        const queryRunnerProvider = new QueryRunnerProvider(this.driver, true);
        return new EntityManager(this, queryRunnerProvider);
    }
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Finds repository aggregator of the given entity class or name.
     */
    findRepositoryAggregator(entityClassOrName) {
        if (!this.isConnected)
            throw new NoConnectionForRepositoryError(this.name);
        if (!this.entityMetadatas.hasTarget(entityClassOrName))
            throw new RepositoryNotFoundError(this.name, entityClassOrName);
        const metadata = this.entityMetadatas.findByTarget(entityClassOrName);
        const repositoryAggregator = this.repositoryAggregators.find(repositoryAggregate => repositoryAggregate.metadata === metadata);
        if (!repositoryAggregator)
            throw new RepositoryNotFoundError(this.name, entityClassOrName);
        return repositoryAggregator;
    }
    /**
     * Builds all registered metadatas.
     */
    buildMetadatas() {
        this.entitySubscribers.length = 0;
        this.entityListeners.length = 0;
        this.repositoryAggregators.length = 0;
        this.entityMetadatas.length = 0;
        const namingStrategy = this.createNamingStrategy();
        const lazyRelationsWrapper = this.createLazyRelationsWrapper();
        // take imported event subscribers
        if (this.subscriberClasses && this.subscriberClasses.length) {
            getMetadataArgsStorage()
                .entitySubscribers
                .filterByTargets(this.subscriberClasses)
                .map(metadata => getFromContainer(metadata.target))
                .forEach(subscriber => this.entitySubscribers.push(subscriber));
        }
        // take imported entity listeners
        if (this.entityClasses && this.entityClasses.length) {
            getMetadataArgsStorage()
                .entityListeners
                .filterByTargets(this.entityClasses)
                .forEach(metadata => this.entityListeners.push(new EntityListenerMetadata(metadata)));
        }
        // build entity metadatas from metadata args storage (collected from decorators)
        if (this.entityClasses && this.entityClasses.length) {
            getFromContainer(EntityMetadataBuilder)
                .buildFromMetadataArgsStorage(this.driver, lazyRelationsWrapper, namingStrategy, this.entityClasses)
                .forEach(metadata => {
                this.entityMetadatas.push(metadata);
                this.repositoryAggregators.push(new RepositoryAggregator(this, metadata));
            });
        }
        // build entity metadatas from given entity schemas
        if (this.entitySchemas && this.entitySchemas.length) {
            getFromContainer(EntityMetadataBuilder)
                .buildFromSchemas(this.driver, lazyRelationsWrapper, namingStrategy, this.entitySchemas)
                .forEach(metadata => {
                this.entityMetadatas.push(metadata);
                this.repositoryAggregators.push(new RepositoryAggregator(this, metadata));
            });
        }
    }
    /**
     * Creates a naming strategy to be used for this connection.
     */
    createNamingStrategy() {
        // if naming strategies are not loaded, or used naming strategy is not set then use default naming strategy
        if (!this.namingStrategyClasses || !this.namingStrategyClasses.length || !this.usedNamingStrategy)
            return getFromContainer(DefaultNamingStrategy);
        // try to find used naming strategy in the list of loaded naming strategies
        const namingMetadata = getMetadataArgsStorage()
            .namingStrategies
            .filterByTargets(this.namingStrategyClasses)
            .find(strategy => {
            if (typeof this.usedNamingStrategy === "string") {
                return strategy.name === this.usedNamingStrategy;
            }
            else {
                return strategy.target === this.usedNamingStrategy;
            }
        });
        // throw an error if not found
        if (!namingMetadata)
            throw new NamingStrategyNotFoundError(this.usedNamingStrategy, this.name);
        // initialize a naming strategy instance
        return getFromContainer(namingMetadata.target);
    }
    /**
     * Creates a new default entity manager without single connection setup.
     */
    createEntityManager() {
        return new EntityManager(this);
    }
    /**
     * Creates a new entity broadcaster using in this connection.
     */
    createBroadcaster() {
        return new Broadcaster(this.entityMetadatas, this.entitySubscribers, this.entityListeners);
    }
    /**
     * Creates a schema builder used to build a database schema for the entities of the current connection.
     */
    createSchemaBuilder() {
        return new SchemaBuilder(this.driver, this.logger, this.entityMetadatas, this.createNamingStrategy());
    }
    /**
     * Creates a lazy relations wrapper.
     */
    createLazyRelationsWrapper() {
        return new LazyRelationsWrapper(this);
    }
}
//# sourceMappingURL=Connection.js.map