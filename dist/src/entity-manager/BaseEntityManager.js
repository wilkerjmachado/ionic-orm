var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { RepositoryAggregator } from "../repository/RepositoryAggregator";
import { RepositoryNotTreeError } from "../connection/error/RepositoryNotTreeError";
import { NoNeedToReleaseEntityManagerError } from "./error/NoNeedToReleaseEntityManagerError";
import { QueryRunnerProviderAlreadyReleasedError } from "../query-runner/error/QueryRunnerProviderAlreadyReleasedError";
/**
 * Common functions shared between different entity manager types.
 */
export class BaseEntityManager {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    /**
     * @param connection Connection to be used in this entity manager
     * @param queryRunnerProvider Custom query runner to be used for operations in this entity manager
     */
    constructor(connection, queryRunnerProvider) {
        this.connection = connection;
        this.queryRunnerProvider = queryRunnerProvider;
        // -------------------------------------------------------------------------
        // Private Properties
        // -------------------------------------------------------------------------
        /**
         * Stores all registered repositories.
         * Used when custom queryRunnerProvider is provided.
         */
        this.repositoryAggregators = [];
    }
    /**
     * Gets repository for the given entity class or name.
     * If single database connection mode is used, then repository is obtained from the
     * repository aggregator, where each repository is individually created for this entity manager.
     * When single database connection is not used, repository is being obtained from the connection.
     */
    getRepository(entityClassOrName) {
        // if single db connection is used then create its own repository with reused query runner
        if (this.queryRunnerProvider)
            return this.obtainRepositoryAggregator(entityClassOrName).repository;
        return this.connection.getRepository(entityClassOrName);
    }
    /**
     * Gets tree repository for the given entity class or name.
     * If single database connection mode is used, then repository is obtained from the
     * repository aggregator, where each repository is individually created for this entity manager.
     * When single database connection is not used, repository is being obtained from the connection.
     */
    getTreeRepository(entityClassOrName) {
        // if single db connection is used then create its own repository with reused query runner
        if (this.queryRunnerProvider) {
            const treeRepository = this.obtainRepositoryAggregator(entityClassOrName).treeRepository;
            if (!treeRepository)
                throw new RepositoryNotTreeError(entityClassOrName);
            return treeRepository;
        }
        return this.connection.getTreeRepository(entityClassOrName);
    }
    /**
     * Gets specific repository for the given entity class or name.
     * If single database connection mode is used, then repository is obtained from the
     * repository aggregator, where each repository is individually created for this entity manager.
     * When single database connection is not used, repository is being obtained from the connection.
     */
    getSpecificRepository(entityClassOrName) {
        // if single db connection is used then create its own repository with reused query runner
        if (this.queryRunnerProvider)
            return this.obtainRepositoryAggregator(entityClassOrName).specificRepository;
        return this.connection.getSpecificRepository(entityClassOrName);
    }
    /**
     * Checks if entity has an id by its Function type or schema name.
     */
    hasId(targetOrEntity, maybeEntity) {
        const target = arguments.length === 2 ? targetOrEntity : targetOrEntity.constructor;
        const entity = arguments.length === 2 ? maybeEntity : targetOrEntity;
        return this.getRepository(target).hasId(entity);
    }
    /**
     * Creates a new query builder that can be used to build an sql query.
     */
    createQueryBuilder(entityClass, alias) {
        return this.getRepository(entityClass).createQueryBuilder(alias);
    }
    /**
     * Creates a new entity instance or instances.
     * Can copy properties from the given object into new entities.
     */
    create(entityClass, plainObjectOrObjects) {
        if (plainObjectOrObjects instanceof Array) {
            return this.getRepository(entityClass).create(plainObjectOrObjects);
        }
        else if (plainObjectOrObjects) {
            return this.getRepository(entityClass).create(plainObjectOrObjects);
        }
        else {
            return this.getRepository(entityClass).create();
        }
    }
    /**
     * Creates a new entity from the given plan javascript object. If entity already exist in the database, then
     * it loads it (and everything related to it), replaces all values with the new ones from the given object
     * and returns this new entity. This new entity is actually a loaded from the db entity with all properties
     * replaced from the new object.
     */
    preload(entityClass, object) {
        return this.getRepository(entityClass).preload(object);
    }
    /**
     * Merges two entities into one new entity.
     */
    merge(entityClass, ...objects) {
        return this.getRepository(entityClass).merge(...objects);
    }
    /**
     * Releases all resources used by entity manager.
     * This is used when entity manager is created with a single query runner,
     * and this single query runner needs to be released after job with entity manager is done.
     */
    release() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.queryRunnerProvider)
                throw new NoNeedToReleaseEntityManagerError();
            return this.queryRunnerProvider.releaseReused();
        });
    }
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Gets, or if does not exist yet, creates and returns a repository aggregator for a particular entity target.
     */
    obtainRepositoryAggregator(entityClassOrName) {
        if (this.queryRunnerProvider && this.queryRunnerProvider.isReleased)
            throw new QueryRunnerProviderAlreadyReleasedError();
        const metadata = this.connection.entityMetadatas.findByTarget(entityClassOrName);
        let repositoryAggregator = this.repositoryAggregators.find(repositoryAggregate => repositoryAggregate.metadata === metadata);
        if (!repositoryAggregator) {
            repositoryAggregator = new RepositoryAggregator(this.connection, this.connection.getMetadata(entityClassOrName), this.queryRunnerProvider);
            this.repositoryAggregators.push(repositoryAggregator);
        }
        return repositoryAggregator;
    }
}
//# sourceMappingURL=BaseEntityManager.js.map