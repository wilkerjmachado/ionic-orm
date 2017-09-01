var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseEntityManager } from "./BaseEntityManager";
import { QueryRunnerProviderAlreadyReleasedError } from "../query-runner/error/QueryRunnerProviderAlreadyReleasedError";
import { QueryRunnerProvider } from "../query-runner/QueryRunnerProvider";
/**
 * Entity manager supposed to work with any entity, automatically find its repository and call its methods,
 * whatever entity type are you passing.
 */
export class EntityManager extends BaseEntityManager {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(connection, queryRunnerProvider) {
        super(connection, queryRunnerProvider);
    }
    /**
     * Persists (saves) a given entity in the database.
     */
    persist(targetOrEntity, maybeEntity) {
        const target = arguments.length === 2 ? maybeEntity : targetOrEntity;
        const entity = arguments.length === 2 ? maybeEntity : targetOrEntity;
        if (typeof target === "string") {
            return this.getRepository(target).persist(entity);
        }
        else {
            if (target instanceof Array) {
                return this.getRepository(target[0].constructor).persist(entity);
            }
            else {
                return this.getRepository(target.constructor).persist(entity);
            }
        }
    }
    /**
     * Removes a given entity from the database.
     */
    remove(targetOrEntity, maybeEntity) {
        const target = arguments.length === 2 ? maybeEntity : targetOrEntity;
        const entity = arguments.length === 2 ? maybeEntity : targetOrEntity;
        if (typeof target === "string") {
            return this.getRepository(target).remove(entity);
        }
        else {
            if (target instanceof Array) {
                return this.getRepository(target[0].constructor).remove(entity);
            }
            else {
                return this.getRepository(target.constructor).remove(entity);
            }
        }
    }
    /**
     * Finds entities that match given conditions.
     */
    find(entityClass, conditionsOrFindOptions, options) {
        if (conditionsOrFindOptions && options) {
            return this.getRepository(entityClass).find(conditionsOrFindOptions, options);
        }
        else if (conditionsOrFindOptions) {
            return this.getRepository(entityClass).find(conditionsOrFindOptions);
        }
        else {
            return this.getRepository(entityClass).find();
        }
    }
    /**
     * Finds entities that match given conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (maxResults, firstResult) options.
     */
    findAndCount(entityClass, conditionsOrFindOptions, options) {
        if (conditionsOrFindOptions && options) {
            return this.getRepository(entityClass).findAndCount(conditionsOrFindOptions, options);
        }
        else if (conditionsOrFindOptions) {
            return this.getRepository(entityClass).findAndCount(conditionsOrFindOptions);
        }
        else {
            return this.getRepository(entityClass).findAndCount();
        }
    }
    /**
     * Finds first entity that matches given conditions.
     */
    findOne(entityClass, conditionsOrFindOptions, options) {
        if (conditionsOrFindOptions && options) {
            return this.getRepository(entityClass).findOne(conditionsOrFindOptions, options);
        }
        else if (conditionsOrFindOptions) {
            return this.getRepository(entityClass).findOne(conditionsOrFindOptions);
        }
        else {
            return this.getRepository(entityClass).findOne();
        }
    }
    /**
     * Finds entity with given id.
     */
    findOneById(entityClass, id, options) {
        return this.getRepository(entityClass).findOneById(id, options);
    }
    /**
     * Executes raw SQL query and returns raw database results.
     */
    query(query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.queryRunnerProvider && this.queryRunnerProvider.isReleased)
                throw new QueryRunnerProviderAlreadyReleasedError();
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
     * All database operations must be executed using provided entity manager.
     */
    transaction(runInTransaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.queryRunnerProvider && this.queryRunnerProvider.isReleased)
                throw new QueryRunnerProviderAlreadyReleasedError();
            const queryRunnerProvider = this.queryRunnerProvider || new QueryRunnerProvider(this.connection.driver, true);
            const queryRunner = yield queryRunnerProvider.provide();
            const transactionEntityManager = new EntityManager(this.connection, queryRunnerProvider);
            try {
                yield queryRunner.beginTransaction();
                const result = yield runInTransaction(transactionEntityManager);
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
}
//# sourceMappingURL=EntityManager.js.map