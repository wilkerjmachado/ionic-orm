var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { QueryBuilder } from "../query-builder/QueryBuilder";
import { PlainObjectToNewEntityTransformer } from "../query-builder/transformer/PlainObjectToNewEntityTransformer";
import { PlainObjectToDatabaseEntityTransformer } from "../query-builder/transformer/PlainObjectToDatabaseEntityTransformer";
import { FindOptionsUtils } from "../find-options/FindOptionsUtils";
import { QueryRunnerProvider } from "../query-runner/QueryRunnerProvider";
import { EntityPersister } from "../persistment/EntityPersister";
/**
 * Repository is supposed to work with your entity objects. Find entities, insert, update, delete, etc.
 */
export class Repository {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(connection, metadata, queryRunnerProvider) {
        this.connection = connection;
        this.metadata = metadata;
        this.queryRunnerProvider = queryRunnerProvider;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Returns object that is managed by this repository.
     * If this repository manages entity from schema,
     * then it returns a name of that schema instead.
     */
    get target() {
        return this.metadata.target;
    }
    /**
     * Checks if entity has an id.
     * If entity contains compose ids, then it checks them all.
     */
    hasId(entity) {
        // if (this.metadata.parentEntityMetadata) {
        //     return this.metadata.parentEntityMetadata.parentIdColumns.every(parentIdColumn => {
        //         const columnName = parentIdColumn.propertyName;
        //         return !!entity &&
        //             entity.hasOwnProperty(columnName) &&
        //             entity[columnName] !== null &&
        //             entity[columnName] !== undefined &&
        //             entity[columnName] !== "";
        //     });
        // } else {
        return this.metadata.primaryColumns.every(primaryColumn => {
            const columnName = primaryColumn.propertyName;
            return !!entity &&
                entity.hasOwnProperty(columnName) &&
                entity[columnName] !== null &&
                entity[columnName] !== undefined &&
                entity[columnName] !== "";
        });
        // }
    }
    /**
     * Creates a new query builder that can be used to build a sql query.
     */
    createQueryBuilder(alias) {
        return new QueryBuilder(this.connection /*, dbConnection*/)
            .select(alias)
            .from(this.metadata.target, alias);
    }
    /**
     * Creates a new entity instance or instances.
     * Can copy properties from the given object into new entities.
     */
    create(plainObjectOrObjects) {
        if (plainObjectOrObjects instanceof Array)
            return plainObjectOrObjects.map(object => this.create(object));
        const newEntity = this.metadata.create();
        if (plainObjectOrObjects) {
            const plainObjectToEntityTransformer = new PlainObjectToNewEntityTransformer();
            plainObjectToEntityTransformer.transform(newEntity, plainObjectOrObjects, this.metadata);
        }
        return newEntity;
    }
    /**
     * Creates a new entity from the given plan javascript object. If entity already exist in the database, then
     * it loads it (and everything related to it), replaces all values with the new ones from the given object
     * and returns this new entity. This new entity is actually a loaded from the db entity with all properties
     * replaced from the new object.
     */
    preload(object) {
        const queryBuilder = this.createQueryBuilder(this.metadata.table.name);
        const plainObjectToDatabaseEntityTransformer = new PlainObjectToDatabaseEntityTransformer();
        return plainObjectToDatabaseEntityTransformer.transform(object, this.metadata, queryBuilder);
    }
    /**
     * Merges multiple entities (or entity-like objects) into a one new entity.
     */
    merge(...objects) {
        const newEntity = this.metadata.create();
        const plainObjectToEntityTransformer = new PlainObjectToNewEntityTransformer();
        objects.forEach(object => plainObjectToEntityTransformer.transform(newEntity, object, this.metadata));
        return newEntity;
    }
    /**
     * Persists one or many given entities.
     */
    persist(entityOrEntities) {
        return __awaiter(this, void 0, void 0, function* () {
            // if multiple entities given then go throw all of them and save them
            if (entityOrEntities instanceof Array)
                return Promise.all(entityOrEntities.map(entity => this.persist(entity)));
            const queryRunnerProvider = this.queryRunnerProvider || new QueryRunnerProvider(this.connection.driver);
            const queryRunner = yield queryRunnerProvider.provide();
            try {
                const entityPersister = new EntityPersister(this.connection, this.metadata, queryRunner);
                return yield entityPersister.persist(entityOrEntities); // await is needed here because we are using finally
                // if (this.hasId(entityOrEntities)) {
                //     return await entityPersister.update(entityOrEntities); // await is needed here because we are using finally
                // } else {
                //     return await entityPersister.insert(entityOrEntities); // await is needed here because we are using finally
                // }
            }
            finally {
                yield queryRunnerProvider.release(queryRunner);
            }
        });
    }
    /**
     * Removes one or many given entities.
     */
    remove(entityOrEntities) {
        return __awaiter(this, void 0, void 0, function* () {
            // if multiple entities given then go throw all of them and save them
            if (entityOrEntities instanceof Array)
                return Promise.all(entityOrEntities.map(entity => this.remove(entity)));
            const queryRunnerProvider = this.queryRunnerProvider || new QueryRunnerProvider(this.connection.driver, true);
            const queryRunner = yield queryRunnerProvider.provide();
            try {
                const entityPersister = new EntityPersister(this.connection, this.metadata, queryRunner);
                return yield entityPersister.remove(entityOrEntities); // await is needed here because we are using finally
            }
            finally {
                yield queryRunnerProvider.release(queryRunner);
            }
        });
    }
    /**
     * Finds entities that match given conditions and/or find options.
     */
    find(conditionsOrFindOptions, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createFindQueryBuilder(conditionsOrFindOptions, options)
                .getResults();
        });
    }
    /**
     * Finds entities that match given conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (maxResults, firstResult) options.
     */
    findAndCount(conditionsOrFindOptions, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createFindQueryBuilder(conditionsOrFindOptions, options)
                .getResultsAndCount();
        });
    }
    /**
     * Finds first entity that matches given conditions and/or find options.
     */
    findOne(conditionsOrFindOptions, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createFindQueryBuilder(conditionsOrFindOptions, options)
                .getSingleResult();
        });
    }
    /**
     * Finds entity with given id.
     * Optionally find options can be applied.
     */
    findOneById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const conditions = {};
            if (this.metadata.hasMultiplePrimaryKeys) {
                this.metadata.primaryColumns.forEach(primaryColumn => {
                    conditions[primaryColumn.name] = id[primaryColumn.name];
                });
                this.metadata.parentIdColumns.forEach(primaryColumn => {
                    conditions[primaryColumn.name] = id[primaryColumn.propertyName];
                });
            }
            else {
                if (this.metadata.primaryColumns.length > 0) {
                    conditions[this.metadata.firstPrimaryColumn.name] = id;
                }
                else if (this.metadata.parentIdColumns.length > 0) {
                    conditions[this.metadata.parentIdColumns[0].name] = id;
                }
            }
            return this.createFindQueryBuilder(conditions, options)
                .getSingleResult();
        });
    }
    /**
     * Executes a raw SQL query and returns a raw database results.
     */
    query(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryRunnerProvider = this.queryRunnerProvider || new QueryRunnerProvider(this.connection.driver);
            const queryRunner = yield queryRunnerProvider.provide();
            try {
                return yield queryRunner.query(query); // await is needed here because we are using finally
            }
            finally {
                yield queryRunnerProvider.release(queryRunner);
            }
        });
    }
    /**
     * Wraps given function execution (and all operations made there) in a transaction.
     * All database operations must be executed using provided repository.
     */
    transaction(runInTransaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryRunnerProvider = this.queryRunnerProvider || new QueryRunnerProvider(this.connection.driver, true);
            const queryRunner = yield queryRunnerProvider.provide();
            const transactionRepository = new Repository(this.connection, this.metadata, queryRunnerProvider);
            try {
                yield queryRunner.beginTransaction();
                const result = yield runInTransaction(transactionRepository);
                yield queryRunner.commitTransaction();
                return result;
            }
            catch (err) {
                yield queryRunner.rollbackTransaction();
                throw err;
            }
            finally {
                yield queryRunnerProvider.release(queryRunner);
                if (!this.queryRunnerProvider)
                    yield queryRunnerProvider.releaseReused();
            }
        });
    }
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Creates a query builder from the given conditions or find options.
     * Used to create a query builder for find* methods.
     */
    createFindQueryBuilder(conditionsOrFindOptions, options) {
        const findOptions = FindOptionsUtils.isFindOptions(conditionsOrFindOptions) ? conditionsOrFindOptions : options;
        const conditions = FindOptionsUtils.isFindOptions(conditionsOrFindOptions) ? undefined : conditionsOrFindOptions;
        const alias = findOptions ? findOptions.alias : this.metadata.table.name;
        const qb = this.createQueryBuilder(alias);
        // if find options are given then apply them to query builder
        if (findOptions)
            FindOptionsUtils.applyOptionsToQueryBuilder(qb, findOptions);
        // if conditions are given then apply them to query builder
        if (conditions) {
            Object.keys(conditions).forEach(key => {
                const name = key.indexOf(".") === -1 ? alias + "." + key : key;
                qb.andWhere(name + "=:" + key);
            });
            qb.addParameters(conditions);
        }
        return qb;
    }
}
//# sourceMappingURL=Repository.js.map