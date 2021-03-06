var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Alias } from "./alias/Alias";
import { AliasMap } from "./alias/AliasMap";
import { RawSqlResultsToEntityTransformer } from "./transformer/RawSqlResultsToEntityTransformer";
/**
 * Allows to build complex sql queries in a fashion way and execute those queries.
 */
export class QueryBuilder {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(connection, queryRunner) {
        this.connection = connection;
        this.queryRunner = queryRunner;
        this.type = "select";
        this.selects = [];
        this.joins = [];
        this.joinRelationIds = [];
        this.relationCountMetas = [];
        this.groupBys = [];
        this.wheres = [];
        this.havings = [];
        this.orderBys = {};
        this.parameters = {};
        this.ignoreParentTablesJoins = false;
        this.aliasMap = new AliasMap(connection.entityMetadatas);
    }
    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------
    /**
     * Gets the main alias string used in this query builder.
     */
    get alias() {
        return this.aliasMap.mainAlias.name;
    }
    /**
     * Creates DELETE query.
     */
    delete(tableNameOrEntity) {
        if (tableNameOrEntity instanceof Function) {
            const aliasName = tableNameOrEntity.name;
            const aliasObj = new Alias(aliasName);
            aliasObj.target = tableNameOrEntity;
            this.aliasMap.addMainAlias(aliasObj);
            this.fromEntity = { alias: aliasObj };
        }
        else if (typeof tableNameOrEntity === "string") {
            this.fromTableName = tableNameOrEntity;
        }
        this.type = "delete";
        return this;
    }
    /**
     * Creates UPDATE query and applies given update values.
     */
    update(tableNameOrEntityOrUpdateSet, maybeUpdateSet) {
        const updateSet = maybeUpdateSet ? maybeUpdateSet : tableNameOrEntityOrUpdateSet;
        if (tableNameOrEntityOrUpdateSet instanceof Function) {
            const aliasName = tableNameOrEntityOrUpdateSet.name;
            const aliasObj = new Alias(aliasName);
            aliasObj.target = tableNameOrEntityOrUpdateSet;
            this.aliasMap.addMainAlias(aliasObj);
            this.fromEntity = { alias: aliasObj };
        }
        else if (typeof tableNameOrEntityOrUpdateSet === "string") {
            this.fromTableName = tableNameOrEntityOrUpdateSet;
        }
        this.type = "update";
        this.updateQuerySet = updateSet;
        return this;
    }
    /**
     * Creates SELECT query and selects given data.
     * Replaces all old selections if they exist.
     */
    select(selection) {
        this.type = "select";
        if (selection) {
            if (selection instanceof Array) {
                this.selects = selection;
            }
            else {
                this.selects = [selection];
            }
        }
        return this;
    }
    /**
     * Adds new selection to the SELECT query.
     */
    addSelect(selection) {
        if (selection instanceof Array)
            this.selects = this.selects.concat(selection);
        else
            this.selects.push(selection);
        return this;
    }
    /**
     * Specifies FROM on which table select/update/delete will be executed.
     * Also sets a main string alias of the selection data.
     */
    from(entityOrTableName, alias) {
        if (entityOrTableName instanceof Function || this.isValueSimpleString(entityOrTableName)) {
            const aliasObj = new Alias(alias);
            aliasObj.target = entityOrTableName;
            this.aliasMap.addMainAlias(aliasObj);
            this.fromEntity = { alias: aliasObj };
        }
        else {
            this.fromTableName = entityOrTableName;
            this.fromTableAlias = alias;
        }
        return this;
    }
    /**
     * INNER JOINs (without selection).
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoin(entityOrProperty, alias, conditionType = "ON", condition = "", parameters) {
        return this.join("INNER", entityOrProperty, alias, conditionType, condition, parameters);
    }
    /**
     * LEFT JOINs (without selection).
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoin(entityOrProperty, alias, conditionType = "ON", condition = "", parameters) {
        return this.join("LEFT", entityOrProperty, alias, conditionType, condition, parameters);
    }
    /**
     * INNER JOINs and adds all selection properties to SELECT.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndSelect(entityOrProperty, alias, conditionType = "ON", condition = "", parameters) {
        this.addSelect(alias);
        return this.join("INNER", entityOrProperty, alias, conditionType, condition, parameters);
    }
    /**
     * LEFT JOINs and adds all selection properties to SELECT.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndSelect(entityOrProperty, alias, conditionType = "ON", condition = "", parameters) {
        this.addSelect(alias);
        return this.join("LEFT", entityOrProperty, alias, conditionType, condition, parameters);
    }
    /**
     * INNER JOINs, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there are multiple rows of selecting data, and mapped result will be an array.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndMapMany(mapToProperty, entityOrProperty, alias, conditionType = "ON", condition = "", parameters) {
        this.addSelect(alias);
        return this.join("INNER", entityOrProperty, alias, conditionType, condition, parameters, mapToProperty, true);
    }
    /**
     * INNER JOINs, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndMapOne(mapToProperty, entityOrProperty, alias, conditionType = "ON", condition = "", parameters) {
        this.addSelect(alias);
        return this.join("INNER", entityOrProperty, alias, conditionType, condition, parameters, mapToProperty, false);
    }
    /**
     * LEFT JOINs, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there are multiple rows of selecting data, and mapped result will be an array.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndMapMany(mapToProperty, entityOrProperty, alias, conditionType = "ON", condition = "", parameters) {
        this.addSelect(alias);
        return this.join("LEFT", entityOrProperty, alias, conditionType, condition, parameters, mapToProperty, true);
    }
    /**
     * LEFT JOINs, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndMapOne(mapToProperty, entityOrProperty, alias, conditionType = "ON", condition = "", parameters) {
        this.addSelect(alias);
        return this.join("LEFT", entityOrProperty, alias, conditionType, condition, parameters, mapToProperty, false);
    }
    /**
     * LEFT JOINs relation id.
     * Optionally, you can add condition and parameters used in condition.
     *
     * @experimental
     */
    leftJoinRelationId(property, conditionType = "ON", condition, parameters) {
        return this.joinRelationId("LEFT", undefined, property, conditionType, condition, parameters);
    }
    /**
     * INNER JOINs relation id.
     * Optionally, you can add condition and parameters used in condition.
     *
     * @experimental
     */
    innerJoinRelationId(property, conditionType, condition, parameters) {
        return this.joinRelationId("INNER", undefined, property, conditionType, condition, parameters);
    }
    /**
     * LEFT JOINs relation id and maps it into some entity's property.
     * Optionally, you can add condition and parameters used in condition.
     *
     * @experimental
     */
    leftJoinRelationIdAndMap(mapToProperty, property, conditionType = "ON", condition = "", parameters) {
        return this.joinRelationId("INNER", mapToProperty, property, conditionType, condition, parameters);
    }
    /**
     * INNER JOINs relation id and maps it into some entity's property.
     * Optionally, you can add condition and parameters used in condition.
     *
     * @experimental
     */
    innerJoinRelationIdAndMap(mapToProperty, property, conditionType = "ON", condition = "", parameters) {
        return this.joinRelationId("INNER", mapToProperty, property, conditionType, condition, parameters);
    }
    /**
     * Counts number of entities of entity's relation.
     * Optionally, you can add condition and parameters used in condition.
     *
     * @experimental
     */
    countRelation(property, conditionType = "ON", condition = "", parameters) {
        const [parentAliasName, parentPropertyName] = property.split(".");
        const alias = parentAliasName + "_" + parentPropertyName + "_relation_count";
        const aliasObj = new Alias(alias);
        this.aliasMap.addAlias(aliasObj);
        aliasObj.parentAliasName = parentAliasName;
        aliasObj.parentPropertyName = parentPropertyName;
        const relationCountMeta = {
            conditionType: conditionType,
            condition: condition,
            alias: aliasObj,
            entities: []
        };
        this.relationCountMetas.push(relationCountMeta);
        if (parameters)
            this.addParameters(parameters);
        return this;
    }
    /**
     * Counts number of entities of entity's relation and maps the value into some entity's property.
     * Optionally, you can add condition and parameters used in condition.
     *
     * @experimental
     */
    countRelationAndMap(mapProperty, property, conditionType = "ON", condition = "", parameters) {
        const [parentAliasName, parentPropertyName] = property.split(".");
        const alias = parentAliasName + "_" + parentPropertyName + "_relation_count";
        const aliasObj = new Alias(alias);
        this.aliasMap.addAlias(aliasObj);
        aliasObj.parentAliasName = parentAliasName;
        aliasObj.parentPropertyName = parentPropertyName;
        const relationCountMeta = {
            mapToProperty: mapProperty,
            conditionType: conditionType,
            condition: condition,
            alias: aliasObj,
            entities: []
        };
        this.relationCountMetas.push(relationCountMeta);
        if (parameters)
            this.addParameters(parameters);
        return this;
    }
    /**
     * Sets WHERE condition in the query builder.
     * If you had previously WHERE expression defined,
     * calling this function will override previously set WHERE conditions.
     * Additionally you can add parameters used in where expression.
     */
    where(where, parameters) {
        this.wheres.push({ type: "simple", condition: where });
        if (parameters)
            this.addParameters(parameters);
        return this;
    }
    /**
     * Adds new AND WHERE condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    andWhere(where, parameters) {
        this.wheres.push({ type: "and", condition: where });
        if (parameters)
            this.addParameters(parameters);
        return this;
    }
    /**
     * Adds new OR WHERE condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    orWhere(where, parameters) {
        this.wheres.push({ type: "or", condition: where });
        if (parameters)
            this.addParameters(parameters);
        return this;
    }
    /**
     * Sets HAVING condition in the query builder.
     * If you had previously HAVING expression defined,
     * calling this function will override previously set HAVING conditions.
     * Additionally you can add parameters used in where expression.
     */
    having(having, parameters) {
        this.havings.push({ type: "simple", condition: having });
        if (parameters)
            this.addParameters(parameters);
        return this;
    }
    /**
     * Adds new AND HAVING condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    andHaving(having, parameters) {
        this.havings.push({ type: "and", condition: having });
        if (parameters)
            this.addParameters(parameters);
        return this;
    }
    /**
     * Adds new OR HAVING condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    orHaving(having, parameters) {
        this.havings.push({ type: "or", condition: having });
        if (parameters)
            this.addParameters(parameters);
        return this;
    }
    /**
     * Sets GROUP BY condition in the query builder.
     * If you had previously GROUP BY expression defined,
     * calling this function will override previously set GROUP BY conditions.
     */
    groupBy(groupBy) {
        this.groupBys = [groupBy];
        return this;
    }
    /**
     * Adds GROUP BY condition in the query builder.
     */
    addGroupBy(groupBy) {
        this.groupBys.push(groupBy);
        return this;
    }
    /**
     * Sets ORDER BY condition in the query builder.
     * If you had previously ORDER BY expression defined,
     * calling this function will override previously set ORDER BY conditions.
     */
    orderBy(sort, order = "ASC") {
        this.orderBys = { [sort]: order };
        return this;
    }
    /**
     * Adds ORDER BY condition in the query builder.
     */
    addOrderBy(sort, order = "ASC") {
        this.orderBys[sort] = order;
        return this;
    }
    /**
     * Set's LIMIT - maximum number of rows to be selected.
     * NOTE that it may not work as you expect if you are using joins.
     * If you want to implement pagination, and you are having join in your query,
     * then use instead setMaxResults instead.
     */
    setLimit(limit) {
        this.limit = limit;
        return this;
    }
    /**
     * Set's OFFSET - selection offset.
     * NOTE that it may not work as you expect if you are using joins.
     * If you want to implement pagination, and you are having join in your query,
     * then use instead setFirstResult instead.
     */
    setOffset(offset) {
        this.offset = offset;
        return this;
    }
    /**
     * Set's maximum number of entities to be selected.
     */
    setMaxResults(maxResults) {
        this.maxResults = maxResults;
        return this;
    }
    /**
     * Set's offset of entities to be selected.
     */
    setFirstResult(firstResult) {
        this.firstResult = firstResult;
        return this;
    }
    /**
     * Sets given parameter's value.
     */
    setParameter(key, value) {
        this.parameters[key] = value;
        return this;
    }
    /**
     * Sets given object literal as parameters.
     * Note, that it clears all previously set parameters.
     */
    setParameters(parameters) {
        this.parameters = {};
        Object.keys(parameters).forEach(key => {
            this.parameters[key] = parameters[key];
        });
        return this;
    }
    /**
     * Adds all parameters from the given object.
     * Unlike setParameters method it does not clear all previously set parameters.
     */
    addParameters(parameters) {
        Object.keys(parameters).forEach(key => {
            this.parameters[key] = parameters[key];
        });
        return this;
    }
    /**
     * Gets all parameters.
     */
    getParameters() {
        const parameters = Object.assign({}, this.parameters);
        // add discriminator column parameter if it exist
        const mainMetadata = this.connection.entityMetadatas.findByTarget(this.aliasMap.mainAlias.target);
        if (mainMetadata.hasDiscriminatorColumn)
            parameters["discriminatorColumnValue"] = mainMetadata.discriminatorValue;
        return parameters;
    }
    /**
     * Gets generated sql that will be executed.
     * Parameters in the query are escaped for the currently used driver.
     */
    getSql() {
        let sql = this.createSelectExpression();
        sql += this.createJoinExpression();
        sql += this.createJoinRelationIdsExpression();
        sql += this.createWhereExpression();
        sql += this.createGroupByExpression();
        sql += this.createHavingExpression();
        sql += this.createOrderByExpression();
        sql += this.createLimitExpression();
        sql += this.createOffsetExpression();
        [sql] = this.connection.driver.escapeQueryWithParameters(sql, this.parameters);
        return sql;
    }
    /**
     * Gets generated sql without parameters being replaced.
     *
     * @experimental
     */
    getGeneratedQuery() {
        let sql = this.createSelectExpression();
        sql += this.createJoinExpression();
        sql += this.createJoinRelationIdsExpression();
        sql += this.createWhereExpression();
        sql += this.createGroupByExpression();
        sql += this.createHavingExpression();
        sql += this.createOrderByExpression();
        sql += this.createLimitExpression();
        sql += this.createOffsetExpression();
        return sql;
    }
    /**
     * Gets sql to be executed with all parameters used in it.
     *
     * @experimental
     */
    getSqlWithParameters(options) {
        let sql = this.createSelectExpression();
        sql += this.createJoinExpression();
        sql += this.createJoinRelationIdsExpression();
        sql += this.createWhereExpression();
        sql += this.createGroupByExpression();
        sql += this.createHavingExpression();
        if (!options || !options.skipOrderBy)
            sql += this.createOrderByExpression();
        sql += this.createLimitExpression();
        sql += this.createOffsetExpression();
        return this.connection.driver.escapeQueryWithParameters(sql, this.getParameters());
    }
    /**
     * Executes sql generated by query builder and returns raw database results.
     */
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            let ownQueryRunner = false;
            let queryRunner = this.queryRunner;
            if (!queryRunner) {
                ownQueryRunner = true;
                queryRunner = yield this.connection.driver.createQueryRunner();
            }
            const [sql, parameters] = this.getSqlWithParameters();
            try {
                return yield queryRunner.query(sql, parameters); // await is needed here because we are using finally
            }
            finally {
                if (ownQueryRunner)
                    yield queryRunner.release();
            }
        });
    }
    /**
     * Executes sql generated by query builder and returns object with scalar results and entities created from them.
     */
    getResultsAndScalarResults() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.aliasMap.hasMainAlias)
                throw new Error(`Alias is not set. Looks like nothing is selected. Use select*, delete, update method to set an alias.`);
            let ownQueryRunner = false;
            let queryRunner = this.queryRunner;
            if (!queryRunner) {
                ownQueryRunner = true;
                queryRunner = yield this.connection.driver.createQueryRunner();
            }
            const mainAliasName = this.aliasMap.mainAlias.name;
            let scalarResults;
            if (this.firstResult || this.maxResults) {
                const [sql, parameters] = this.getSqlWithParameters(); // todo: fix for sql server. We cant skip order by here! // { skipOrderBy: true }
                const distinctAlias = this.connection.driver.escapeTableName("distinctAlias");
                const metadata = this.connection.entityMetadatas.findByTarget(this.fromEntity.alias.target);
                let idsQuery = `SELECT `;
                idsQuery += metadata.primaryColumns.map((primaryColumn, index) => {
                    const propertyName = this.connection.driver.escapeAliasName(mainAliasName + "_" + primaryColumn.name);
                    if (index === 0) {
                        return `DISTINCT(${distinctAlias}.${propertyName}) as ids_${primaryColumn.name}`;
                    }
                    else {
                        return `${distinctAlias}.${propertyName}) as ids_${primaryColumn.name}`;
                    }
                }).join(", ");
                idsQuery += ` FROM (${sql}) ${distinctAlias}`; // TODO: WHAT TO DO WITH PARAMETERS HERE? DO THEY WORK?
                if (this.maxResults)
                    idsQuery += " LIMIT " + this.maxResults;
                if (this.firstResult)
                    idsQuery += " OFFSET " + this.firstResult;
                try {
                    return yield queryRunner.query(idsQuery, parameters)
                        .then((results) => {
                        scalarResults = results;
                        if (results.length === 0)
                            return [];
                        let condition = "";
                        const parameters = {};
                        if (metadata.hasMultiplePrimaryKeys) {
                            condition = results.map(result => {
                                return metadata.primaryColumns.map(primaryColumn => {
                                    parameters["ids_" + primaryColumn.propertyName] = result["ids_" + primaryColumn.propertyName];
                                    return mainAliasName + "." + primaryColumn.propertyName + "=:ids_" + primaryColumn.propertyName;
                                }).join(" AND ");
                            }).join(" OR ");
                        }
                        else {
                            parameters["ids"] = results.map(result => result["ids_" + metadata.firstPrimaryColumn.propertyName]);
                            condition = mainAliasName + "." + metadata.firstPrimaryColumn.propertyName + " IN (:ids)";
                        }
                        const [queryWithIdsSql, queryWithIdsParameters] = this.clone({ queryRunner: queryRunner })
                            .andWhere(condition, parameters)
                            .getSqlWithParameters();
                        return queryRunner.query(queryWithIdsSql, queryWithIdsParameters);
                    })
                        .then(results => {
                        return this.rawResultsToEntities(results);
                    })
                        .then(results => this.connection.broadcaster.broadcastLoadEventsForAll(this.aliasMap.mainAlias.target, results).then(() => results))
                        .then(results => {
                        return {
                            entities: results,
                            scalarResults: scalarResults
                        };
                    });
                }
                finally {
                    if (ownQueryRunner)
                        yield queryRunner.release();
                }
            }
            else {
                const [sql, parameters] = this.getSqlWithParameters();
                try {
                    // console.log(sql);
                    return yield queryRunner.query(sql, parameters)
                        .then(results => {
                        scalarResults = results;
                        return this.rawResultsToEntities(results);
                    })
                        .then(results => {
                        return this.loadRelationCounts(queryRunner, results)
                            .then(counts => {
                            // console.log("counts: ", counts);
                            return results;
                        });
                    })
                        .then(results => {
                        return this.connection.broadcaster
                            .broadcastLoadEventsForAll(this.aliasMap.mainAlias.target, results)
                            .then(() => results);
                    })
                        .then(results => {
                        return {
                            entities: results,
                            scalarResults: scalarResults
                        };
                    });
                }
                finally {
                    if (ownQueryRunner)
                        yield queryRunner.release();
                }
            }
        });
    }
    /**
     * Gets count - number of entities selected by sql generated by this query builder.
     * Count excludes all limitations set by setFirstResult and setMaxResults methods call.
     */
    getCount() {
        return __awaiter(this, void 0, void 0, function* () {
            let ownQueryRunner = false;
            let queryRunner = this.queryRunner;
            if (!queryRunner) {
                ownQueryRunner = true;
                queryRunner = yield this.connection.driver.createQueryRunner();
            }
            const mainAlias = this.aliasMap.mainAlias.name;
            const metadata = this.connection.entityMetadatas.findByTarget(this.fromEntity.alias.target);
            const distinctAlias = this.connection.driver.escapeAliasName(mainAlias);
            let countSql = `COUNT(` + metadata.primaryColumnsWithParentIdColumns.map((primaryColumn, index) => {
                const propertyName = this.connection.driver.escapeColumnName(primaryColumn.name);
                if (index === 0) {
                    return `DISTINCT(${distinctAlias}.${propertyName})`;
                }
                else {
                    return `${distinctAlias}.${propertyName})`;
                }
            }).join(", ") + ") as cnt";
            const countQuery = this
                .clone({ queryRunner: queryRunner, skipOrderBys: true, ignoreParentTablesJoins: true })
                .select(countSql);
            const [countQuerySql, countQueryParameters] = countQuery.getSqlWithParameters();
            try {
                const results = yield queryRunner.query(countQuerySql, countQueryParameters);
                if (!results || !results[0] || !results[0]["cnt"])
                    return 0;
                return parseInt(results[0]["cnt"]);
            }
            finally {
                if (ownQueryRunner)
                    yield queryRunner.release();
            }
        });
    }
    /**
     * Gets all scalar results returned by execution of generated query builder sql.
     */
    getScalarResults() {
        return this.execute();
    }
    /**
     * Gets first scalar result returned by execution of generated query builder sql.
     */
    getSingleScalarResult() {
        return this.getScalarResults().then(results => results[0]);
    }
    /**
     * Gets entities and count returned by execution of generated query builder sql.
     */
    getResultsAndCount() {
        // todo: share database connection and counter
        return Promise.all([
            this.getResults(),
            this.getCount()
        ]);
    }
    /**
     * Gets entities returned by execution of generated query builder sql.
     */
    getResults() {
        return this.getResultsAndScalarResults().then(results => {
            return results.entities;
        });
    }
    /**
     * Gets single entity returned by execution of generated query builder sql.
     */
    getSingleResult() {
        return this.getResults().then(entities => entities[0]);
    }
    /**
     * Clones query builder as it is.
     */
    clone(options) {
        const qb = new QueryBuilder(this.connection, options ? options.queryRunner : undefined);
        if (options && options.ignoreParentTablesJoins)
            qb.ignoreParentTablesJoins = options.ignoreParentTablesJoins;
        switch (this.type) {
            case "select":
                qb.select(this.selects);
                break;
            case "update":
                qb.update(this.updateQuerySet);
                break;
            case "delete":
                qb.delete();
                break;
        }
        if (this.fromEntity && this.fromEntity.alias && this.fromEntity.alias.target) {
            qb.from(this.fromEntity.alias.target, this.fromEntity.alias.name);
        }
        else if (this.fromTableName) {
            qb.from(this.fromTableName, this.fromTableAlias);
        }
        this.joins.forEach(join => {
            const property = join.tableName || join.alias.target || (join.alias.parentAliasName + "." + join.alias.parentPropertyName);
            qb.join(join.type, property, join.alias.name, join.conditionType, join.condition || "", undefined, join.mapToProperty, join.isMappingMany);
        });
        this.groupBys.forEach(groupBy => qb.addGroupBy(groupBy));
        this.wheres.forEach(where => {
            switch (where.type) {
                case "simple":
                    qb.where(where.condition);
                    break;
                case "and":
                    qb.andWhere(where.condition);
                    break;
                case "or":
                    qb.orWhere(where.condition);
                    break;
            }
        });
        this.havings.forEach(having => {
            switch (having.type) {
                case "simple":
                    qb.having(having.condition);
                    break;
                case "and":
                    qb.andHaving(having.condition);
                    break;
                case "or":
                    qb.orHaving(having.condition);
                    break;
            }
        });
        if (!options || !options.skipOrderBys)
            Object.keys(this.orderBys).forEach(columnName => qb.addOrderBy(columnName, this.orderBys[columnName]));
        Object.keys(this.parameters).forEach(key => qb.setParameter(key, this.parameters[key]));
        if (!options || !options.skipLimit)
            qb.setLimit(this.limit);
        if (!options || !options.skipOffset)
            qb.setOffset(this.offset);
        qb.setFirstResult(this.firstResult)
            .setMaxResults(this.maxResults);
        return qb;
    }
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    loadRelationCounts(queryRunner, results) {
        const promises = this.relationCountMetas.map(relationCountMeta => {
            const parentAlias = relationCountMeta.alias.parentAliasName;
            const foundAlias = this.aliasMap.findAliasByName(parentAlias);
            if (!foundAlias)
                throw new Error(`Alias "${parentAlias}" was not found`);
            const parentMetadata = this.aliasMap.getEntityMetadataByAlias(foundAlias);
            if (!parentMetadata)
                throw new Error("Cannot get entity metadata for the given alias " + foundAlias.name);
            const relation = parentMetadata.findRelationWithPropertyName(relationCountMeta.alias.parentPropertyName);
            const queryBuilder = new QueryBuilder(this.connection, queryRunner);
            let condition = "";
            const metadata = this.aliasMap.getEntityMetadataByAlias(relationCountMeta.alias);
            if (!metadata)
                throw new Error("Cannot get entity metadata for the given alias " + relationCountMeta.alias.name);
            let joinTableName = metadata.table.name;
            const junctionMetadata = relation.junctionEntityMetadata;
            const appendedCondition = relationCountMeta.condition ? " AND " + this.replacePropertyNames(relationCountMeta.condition) : "";
            /*if (relation.isManyToMany) {
             const junctionTable = junctionMetadata.table.name;
             const junctionAlias = relationCountMeta.alias.parentAliasName + "_" + relationCountMeta.alias.name;
             const joinAlias = relationCountMeta.alias.name;
             const joinTable = relation.isOwning ? relation.joinTable : relation.inverseRelation.joinTable; // not sure if this is correct
             const joinTableColumn = joinTable.referencedColumn.name; // not sure if this is correct
             const inverseJoinColumnName = joinTable.inverseReferencedColumn.name; // not sure if this is correct

             let condition1 = "", condition2 = "";
             if (relation.isOwning) {
             condition1 = junctionAlias + "." + junctionMetadata.columns[0].name + "=" + parentAlias + "." + joinTableColumn;
             condition2 = joinAlias + "." + inverseJoinColumnName + "=" + junctionAlias + "." + junctionMetadata.columns[1].name;
             } else {
             condition1 = junctionAlias + "." + junctionMetadata.columns[1].name + "=" + parentAlias + "." + joinTableColumn;
             condition2 = joinAlias + "." + inverseJoinColumnName + "=" + junctionAlias + "." + junctionMetadata.columns[0].name;
             }

             condition = " LEFT JOIN " + junctionTable + " " + junctionAlias + " " + relationCountMeta.conditionType + " " + condition1 +
             " LEFT JOIN " + joinTableName + " " + joinAlias + " " + relationCountMeta.conditionType + " " + condition2 + appendedCondition;

             } else if (relation.isManyToOne || (relation.isOneToOne && relation.isOwning)) {
             const joinTableColumn = relation.joinColumn.referencedColumn.name;
             const condition2 = relationCountMeta.alias.name + "." + joinTableColumn + "=" + parentAlias + "." + relation.name;
             condition = " LEFT JOIN " + joinTableName + " " + relationCountMeta.alias.name + " " + relationCountMeta.conditionType + " " + condition2 + appendedCondition;

             } else {
             throw new Error(`Relation count can be applied only `); // this should be done on entity build
             }*/
            // if (relationCountMeta.condition)
            //     condition += relationCountMeta.condition;
            // relationCountMeta.alias.target;
            // todo: FIX primaryColumn usages
            const ids = relationCountMeta.entities
                .map(entityWithMetadata => entityWithMetadata.metadata.getEntityIdMap(entityWithMetadata.entity))
                .filter(idMap => idMap !== undefined)
                .map(idMap => idMap[parentMetadata.primaryColumn.propertyName]);
            if (!ids || !ids.length)
                return Promise.resolve(); // todo: need to set zero to relationCount column in this case?
            return queryBuilder
                .select(`${parentMetadata.name + "." + parentMetadata.primaryColumn.propertyName} AS id`)
                .addSelect(`COUNT(${this.connection.driver.escapeAliasName(relation.propertyName) + "." + this.connection.driver.escapeColumnName(relation.inverseEntityMetadata.primaryColumn.name)}) as cnt`)
                .from(parentMetadata.target, parentMetadata.name)
                .leftJoin(parentMetadata.name + "." + relation.propertyName, relation.propertyName, relationCountMeta.conditionType, relationCountMeta.condition)
                .setParameters(this.parameters)
                .where(`${parentMetadata.name + "." + parentMetadata.primaryColumn.propertyName} IN (:relationCountIds)`, { relationCountIds: ids })
                .groupBy(parentMetadata.name + "." + parentMetadata.primaryColumn.propertyName)
                .getScalarResults()
                .then((results) => {
                // console.log(relationCountMeta.entities);
                relationCountMeta.entities.forEach(entityWithMetadata => {
                    const entityId = entityWithMetadata.entity[entityWithMetadata.metadata.primaryColumn.propertyName];
                    const entityResult = results.find(result => {
                        return entityId === this.connection.driver.prepareHydratedValue(result.id, entityWithMetadata.metadata.primaryColumn);
                    });
                    if (entityResult) {
                        if (relationCountMeta.mapToProperty) {
                            const [parentName, propertyName] = relationCountMeta.mapToProperty.split(".");
                            // todo: right now mapping is working only on the currently countRelation class, but
                            // different properties are working. make different classes to work too
                            entityWithMetadata.entity[propertyName] = parseInt(entityResult.cnt);
                        }
                        else if (relation.countField) {
                            entityWithMetadata.entity[relation.countField] = parseInt(entityResult.cnt);
                        }
                    }
                });
            });
        });
        return Promise.all(promises);
    }
    rawResultsToEntities(results) {
        const transformer = new RawSqlResultsToEntityTransformer(this.connection.driver, this.aliasMap, this.extractJoinMappings(), this.relationCountMetas);
        return transformer.transform(results);
    }
    createSelectExpression() {
        // todo throw exception if selects or from is missing
        let alias = "", tableName;
        const allSelects = [];
        if (this.fromTableName) {
            tableName = this.fromTableName;
            alias = this.fromTableAlias;
            // console.log("ALIAS F:", alias);
        }
        else if (this.fromEntity) {
            const metadata = this.aliasMap.getEntityMetadataByAlias(this.fromEntity.alias);
            if (!metadata)
                throw new Error("Cannot get entity metadata for the given alias " + this.fromEntity.alias.name);
            tableName = metadata.table.name;
            alias = this.fromEntity.alias.name;
            // console.log("ALIAS N:", this.fromEntity.alias);
            // console.log("ALIAS N:", alias);
            // add select from the main table
            if (this.selects.indexOf(alias) !== -1) {
                metadata.columns.forEach(column => {
                    allSelects.push(this.connection.driver.escapeAliasName(alias) + "." + this.connection.driver.escapeColumnName(column.name) + " AS " + this.connection.driver.escapeAliasName(alias + "_" + column.name));
                });
            }
        }
        else {
            throw new Error("No from given");
        }
        // add selects from joins
        this.joins
            .filter(join => this.selects.indexOf(join.alias.name) !== -1)
            .forEach(join => {
            const joinMetadata = this.aliasMap.getEntityMetadataByAlias(join.alias);
            if (joinMetadata) {
                joinMetadata.columns.forEach(column => {
                    allSelects.push(this.connection.driver.escapeAliasName(join.alias.name) + "." + this.connection.driver.escapeColumnName(column.name) + " AS " + this.connection.driver.escapeAliasName(join.alias.name + "_" + column.name));
                });
            }
            else {
                allSelects.push(this.connection.driver.escapeAliasName(join.alias.name));
            }
        });
        if (!this.ignoreParentTablesJoins) {
            const metadata = this.connection.entityMetadatas.findByTarget(this.aliasMap.mainAlias.target);
            if (metadata.parentEntityMetadata && metadata.parentIdColumns) {
                const alias = "parentIdColumn_" + this.connection.driver.escapeAliasName(metadata.parentEntityMetadata.table.name);
                metadata.parentEntityMetadata.columns.forEach(column => {
                    allSelects.push(alias + "." + this.connection.driver.escapeColumnName(column.name) + " AS " + alias + "_" + this.connection.driver.escapeAliasName(column.name));
                });
            }
        }
        // add selects from relation id joins
        this.joinRelationIds.forEach(join => {
            // const joinMetadata = this.aliasMap.getEntityMetadataByAlias(join.alias);
            const parentAlias = join.alias.parentAliasName;
            const foundAlias = this.aliasMap.findAliasByName(parentAlias);
            if (!foundAlias)
                throw new Error(`Alias "${parentAlias}" was not found`);
            const parentMetadata = this.aliasMap.getEntityMetadataByAlias(foundAlias);
            if (!parentMetadata)
                throw new Error("Cannot get entity metadata for the given alias " + foundAlias.name);
            const relation = parentMetadata.findRelationWithPropertyName(join.alias.parentPropertyName);
            const junctionMetadata = relation.junctionEntityMetadata;
            // const junctionTable = junctionMetadata.table.name;
            junctionMetadata.columns.forEach(column => {
                allSelects.push(this.connection.driver.escapeAliasName(join.alias.name) + "." + this.connection.driver.escapeColumnName(column.name) + " AS " + this.connection.driver.escapeAliasName(join.alias.name + "_" + column.name));
            });
        });
        // add all other selects
        this.selects.filter(select => {
            return select !== alias && !this.joins.find(join => join.alias.name === select);
        }).forEach(select => allSelects.push(this.replacePropertyNames(select)));
        // if still selection is empty, then simply set it to all (*)
        if (allSelects.length === 0)
            allSelects.push("*");
        // create a selection query
        switch (this.type) {
            case "select":
                return "SELECT " + allSelects.join(", ") + " FROM " + this.connection.driver.escapeTableName(tableName) + " " + this.connection.driver.escapeAliasName(alias);
            case "delete":
                return "DELETE " + (alias ? this.connection.driver.escapeAliasName(alias) : "") + " FROM " + this.connection.driver.escapeTableName(tableName) + " " + (alias ? this.connection.driver.escapeAliasName(alias) : "");
            case "update":
                const updateSet = Object.keys(this.updateQuerySet).map(key => key + "=:updateQuerySet_" + key);
                const params = Object.keys(this.updateQuerySet).reduce((object, key) => {
                    // todo: map propertyNames to names ?
                    object["updateQuerySet_" + key] = this.updateQuerySet[key];
                    return object;
                }, {});
                this.addParameters(params);
                return "UPDATE " + tableName + " " + (alias ? this.connection.driver.escapeAliasName(alias) : "") + " SET " + updateSet;
        }
        throw new Error("No query builder type is specified.");
    }
    createWhereExpression() {
        const conditions = this.wheres.map((where, index) => {
            switch (where.type) {
                case "and":
                    return (index > 0 ? "AND " : "") + this.replacePropertyNames(where.condition);
                case "or":
                    return (index > 0 ? "OR " : "") + this.replacePropertyNames(where.condition);
                default:
                    return this.replacePropertyNames(where.condition);
            }
        }).join(" ");
        const mainMetadata = this.connection.entityMetadatas.findByTarget(this.aliasMap.mainAlias.target);
        if (mainMetadata.hasDiscriminatorColumn)
            return ` WHERE ${conditions.length ? "(" + conditions + ")" : ""} AND ${mainMetadata.discriminatorColumn.name}=:discriminatorColumnValue`;
        if (!conditions.length)
            return "";
        return " WHERE " + conditions;
    }
    /**
     * Replaces all entity's propertyName to name in the given statement.
     */
    replacePropertyNames(statement) {
        this.aliasMap.aliases.forEach(alias => {
            const metadata = this.aliasMap.getEntityMetadataByAlias(alias);
            if (!metadata)
                return;
            metadata.embeddeds.forEach(embedded => {
                embedded.columns.forEach(column => {
                    const expression = alias.name + "." + embedded.propertyName + "." + column.propertyName + "([ =]|.{0}$)";
                    statement = statement.replace(new RegExp(expression, "gm"), this.connection.driver.escapeAliasName(alias.name) + "." + this.connection.driver.escapeColumnName(column.name) + "$1");
                });
            });
            metadata.columns.forEach(column => {
                const expression = alias.name + "." + column.propertyName + "([ =]|.{0}$)";
                statement = statement.replace(new RegExp(expression, "gm"), this.connection.driver.escapeAliasName(alias.name) + "." + this.connection.driver.escapeColumnName(column.name) + "$1");
            });
            metadata.relationsWithJoinColumns.forEach(relation => {
                const expression = alias.name + "." + relation.propertyName + "([ =]|.{0}$)";
                statement = statement.replace(new RegExp(expression, "gm"), this.connection.driver.escapeAliasName(alias.name) + "." + this.connection.driver.escapeColumnName(relation.name) + "$1");
            });
        });
        return statement;
    }
    createJoinRelationIdsExpression() {
        return this.joinRelationIds.map(join => {
            const parentAlias = join.alias.parentAliasName;
            const foundAlias = this.aliasMap.findAliasByName(parentAlias);
            if (!foundAlias)
                throw new Error(`Alias "${parentAlias}" was not found`);
            const parentMetadata = this.aliasMap.getEntityMetadataByAlias(foundAlias);
            if (!parentMetadata)
                throw new Error("Cannot get entity metadata for the given alias " + foundAlias.name);
            const relation = parentMetadata.findRelationWithPropertyName(join.alias.parentPropertyName);
            const junctionMetadata = relation.junctionEntityMetadata;
            const junctionTable = junctionMetadata.table.name;
            const junctionAlias = join.alias.name;
            const joinTable = relation.isOwning ? relation.joinTable : relation.inverseRelation.joinTable; // not sure if this is correct
            const joinTableColumn = joinTable.referencedColumn.name; // not sure if this is correct
            let condition1 = "";
            if (relation.isOwning) {
                condition1 = this.connection.driver.escapeAliasName(junctionAlias) + "." + this.connection.driver.escapeColumnName(junctionMetadata.columns[0].name) + "=" + this.connection.driver.escapeAliasName(parentAlias) + "." + this.connection.driver.escapeColumnName(joinTableColumn);
                // condition2 = joinAlias + "." + inverseJoinColumnName + "=" + junctionAlias + "." + junctionMetadata.columns[1].name;
            }
            else {
                condition1 = this.connection.driver.escapeAliasName(junctionAlias) + "." + this.connection.driver.escapeColumnName(junctionMetadata.columns[1].name) + "=" + this.connection.driver.escapeAliasName(parentAlias) + "." + this.connection.driver.escapeColumnName(joinTableColumn);
                // condition2 = joinAlias + "." + inverseJoinColumnName + "=" + junctionAlias + "." + junctionMetadata.columns[0].name;
            }
            return " " + join.type + " JOIN " + junctionTable + " " + this.connection.driver.escapeAliasName(junctionAlias) + " " + join.conditionType + " " + condition1;
            // " " + joinType + " JOIN " + joinTableName + " " + joinAlias + " " + join.conditionType + " " + condition2 + appendedCondition;
            // console.log(join);
            // return " " + join.type + " JOIN " + joinTableName + " " + join.alias.name + " " + (join.condition ? (join.conditionType + " " + join.condition) : "");
        });
    }
    createJoinExpression() {
        let joins = this.joins.map(join => {
            const joinType = join.type; // === "INNER" ? "INNER" : "LEFT";
            let joinTableName = join.tableName;
            if (!joinTableName) {
                const metadata = this.aliasMap.getEntityMetadataByAlias(join.alias);
                if (!metadata)
                    throw new Error("Cannot get entity metadata for the given alias " + join.alias.name);
                joinTableName = metadata.table.name;
            }
            const parentAlias = join.alias.parentAliasName;
            if (!parentAlias) {
                return " " + joinType + " JOIN " + this.connection.driver.escapeTableName(joinTableName) + " " + this.connection.driver.escapeAliasName(join.alias.name) + " " + (join.condition ? (join.conditionType + " " + this.replacePropertyNames(join.condition)) : "");
            }
            const foundAlias = this.aliasMap.findAliasByName(parentAlias);
            if (!foundAlias)
                throw new Error(`Alias "${parentAlias}" was not found`);
            const parentMetadata = this.aliasMap.getEntityMetadataByAlias(foundAlias);
            if (!parentMetadata)
                throw new Error("Cannot get entity metadata for the given alias " + foundAlias.name);
            const relation = parentMetadata.findRelationWithPropertyName(join.alias.parentPropertyName);
            const junctionMetadata = relation.junctionEntityMetadata;
            const appendedCondition = join.condition ? " AND " + this.replacePropertyNames(join.condition) : "";
            if (relation.isManyToMany) {
                const junctionTable = junctionMetadata.table.name;
                const junctionAlias = join.alias.parentAliasName + "_" + join.alias.name;
                const joinAlias = join.alias.name;
                const joinTable = relation.isOwning ? relation.joinTable : relation.inverseRelation.joinTable; // not sure if this is correct
                const joinTableColumn = joinTable.referencedColumn.name; // not sure if this is correct
                const inverseJoinColumnName = joinTable.inverseReferencedColumn.name; // not sure if this is correct
                let condition1 = "", condition2 = "";
                if (relation.isOwning) {
                    condition1 = this.connection.driver.escapeAliasName(junctionAlias) + "." + this.connection.driver.escapeColumnName(junctionMetadata.columns[0].name) + "=" + this.connection.driver.escapeAliasName(parentAlias) + "." + this.connection.driver.escapeColumnName(joinTableColumn);
                    condition2 = this.connection.driver.escapeAliasName(joinAlias) + "." + this.connection.driver.escapeColumnName(inverseJoinColumnName) + "=" + this.connection.driver.escapeAliasName(junctionAlias) + "." + this.connection.driver.escapeColumnName(junctionMetadata.columns[1].name);
                }
                else {
                    condition1 = this.connection.driver.escapeAliasName(junctionAlias) + "." + this.connection.driver.escapeColumnName(junctionMetadata.columns[1].name) + "=" + this.connection.driver.escapeAliasName(parentAlias) + "." + this.connection.driver.escapeColumnName(joinTableColumn);
                    condition2 = this.connection.driver.escapeAliasName(joinAlias) + "." + this.connection.driver.escapeColumnName(inverseJoinColumnName) + "=" + this.connection.driver.escapeAliasName(junctionAlias) + "." + this.connection.driver.escapeColumnName(junctionMetadata.columns[0].name);
                }
                return " " + joinType + " JOIN " + this.connection.driver.escapeTableName(junctionTable) + " " + this.connection.driver.escapeAliasName(junctionAlias) + " " + join.conditionType + " " + condition1 +
                    " " + joinType + " JOIN " + this.connection.driver.escapeTableName(joinTableName) + " " + this.connection.driver.escapeAliasName(joinAlias) + " " + join.conditionType + " " + condition2 + appendedCondition;
            }
            else if (relation.isManyToOne || (relation.isOneToOne && relation.isOwning)) {
                const joinTableColumn = relation.joinColumn.referencedColumn.name;
                const condition = this.connection.driver.escapeAliasName(join.alias.name) + "." + this.connection.driver.escapeColumnName(joinTableColumn) + "=" + this.connection.driver.escapeAliasName(parentAlias) + "." + this.connection.driver.escapeColumnName(relation.name);
                return " " + joinType + " JOIN " + this.connection.driver.escapeTableName(joinTableName) + " " + this.connection.driver.escapeAliasName(join.alias.name) + " " + join.conditionType + " " + condition + appendedCondition;
            }
            else if (relation.isOneToMany || (relation.isOneToOne && !relation.isOwning)) {
                const joinTableColumn = relation.inverseRelation.joinColumn.referencedColumn.name;
                const condition = this.connection.driver.escapeAliasName(join.alias.name) + "." + this.connection.driver.escapeColumnName(relation.inverseRelation.name) + "=" + this.connection.driver.escapeAliasName(parentAlias) + "." + this.connection.driver.escapeColumnName(joinTableColumn);
                return " " + joinType + " JOIN " + this.connection.driver.escapeTableName(joinTableName) + " " + this.connection.driver.escapeAliasName(join.alias.name) + " " + join.conditionType + " " + condition + appendedCondition;
            }
            else {
                throw new Error("Unexpected relation type"); // this should not be possible
            }
        }).join(" ");
        if (!this.ignoreParentTablesJoins) {
            const metadata = this.connection.entityMetadatas.findByTarget(this.aliasMap.mainAlias.target);
            if (metadata.parentEntityMetadata && metadata.parentIdColumns) {
                const alias = this.connection.driver.escapeAliasName("parentIdColumn_" + metadata.parentEntityMetadata.table.name);
                joins += " JOIN " + this.connection.driver.escapeTableName(metadata.parentEntityMetadata.table.name)
                    + " " + alias + " ON ";
                joins += metadata.parentIdColumns.map(parentIdColumn => {
                    return this.aliasMap.mainAlias.name + "." + parentIdColumn.name + "=" + alias + "." + parentIdColumn.propertyName;
                });
            }
        }
        return joins;
    }
    createGroupByExpression() {
        if (!this.groupBys || !this.groupBys.length)
            return "";
        return " GROUP BY " + this.replacePropertyNames(this.groupBys.join(", "));
    }
    createHavingExpression() {
        if (!this.havings || !this.havings.length)
            return "";
        return " HAVING " + this.havings.map(having => {
            switch (having.type) {
                case "and":
                    return " AND " + this.replacePropertyNames(having.condition);
                case "or":
                    return " OR " + this.replacePropertyNames(having.condition);
                default:
                    return " " + this.replacePropertyNames(having.condition);
            }
        }).join(" ");
    }
    createOrderByExpression() {
        // if user specified a custom order then apply it
        if (Object.keys(this.orderBys).length > 0)
            return " ORDER BY " + Object.keys(this.orderBys).map(columnName => this.replacePropertyNames(columnName) + " " + this.orderBys[columnName]).join(", ");
        // if table has a default order then apply it
        const metadata = this.connection.entityMetadatas.findByTarget(this.aliasMap.mainAlias.target);
        if (metadata.table.orderBy)
            return " ORDER BY " + Object
                .keys(metadata.table.orderBy)
                .map(key => this.replacePropertyNames(key) + " " + metadata.table.orderBy[key])
                .join(", ");
        return "";
    }
    createLimitExpression() {
        if (!this.limit)
            return "";
        return " LIMIT " + this.limit;
    }
    createOffsetExpression() {
        if (!this.offset)
            return "";
        return " OFFSET " + this.offset;
    }
    extractJoinMappings() {
        const mappings = [];
        this.joins
            .filter(join => !!join.mapToProperty)
            .forEach(join => {
            const [parentName, propertyName] = join.mapToProperty.split(".");
            mappings.push({
                type: "join",
                alias: join.alias,
                parentName: parentName,
                propertyName: propertyName,
                isMany: join.isMappingMany
            });
        });
        this.joinRelationIds
            .filter(join => !!join.mapToProperty)
            .forEach(join => {
            const [parentName, propertyName] = join.mapToProperty.split(".");
            mappings.push({
                type: "relationId",
                alias: join.alias,
                parentName: parentName,
                propertyName: propertyName,
                isMany: false
            });
        });
        return mappings;
    }
    join(joinType, entityOrProperty, alias, conditionType = "ON", condition = "", parameters, mapToProperty, isMappingMany = false) {
        // todo: entityOrProperty can be a table name. implement if its a table
        // todo: entityOrProperty can be target name. implement proper behaviour if it is.
        let tableName = "";
        const aliasObj = new Alias(alias);
        this.aliasMap.addAlias(aliasObj);
        if (entityOrProperty instanceof Function) {
            aliasObj.target = entityOrProperty;
        }
        else if (this.isPropertyAlias(entityOrProperty)) {
            [aliasObj.parentAliasName, aliasObj.parentPropertyName] = entityOrProperty.split(".");
        }
        else if (typeof entityOrProperty === "string") {
            tableName = entityOrProperty;
            if (!mapToProperty)
                mapToProperty = entityOrProperty;
        }
        const join = { type: joinType, alias: aliasObj, tableName: tableName, conditionType: conditionType, condition: condition, mapToProperty: mapToProperty, isMappingMany: isMappingMany };
        this.joins.push(join);
        if (parameters)
            this.addParameters(parameters);
        return this;
    }
    joinRelationId(joinType, mapToProperty, property, conditionType = "ON", condition, parameters) {
        if (!this.isPropertyAlias(property))
            throw new Error("Only entity relations are allowed in the leftJoinRelationId operation"); // todo: also check if that relation really has entityId
        const [parentAliasName, parentPropertyName] = property.split(".");
        const alias = parentAliasName + "_" + parentPropertyName + "_relation_id";
        const aliasObj = new Alias(alias);
        this.aliasMap.addAlias(aliasObj);
        aliasObj.parentAliasName = parentAliasName;
        aliasObj.parentPropertyName = parentPropertyName;
        this.joinRelationIds.push({
            type: joinType,
            mapToProperty: mapToProperty,
            alias: aliasObj,
            conditionType: conditionType,
            condition: condition
        });
        if (parameters)
            this.addParameters(parameters);
        return this;
    }
    isValueSimpleString(str) {
        return /^[A-Za-z0-9_-]+$/.test(str);
    }
    isPropertyAlias(str) {
        if (!(typeof str === "string"))
            return false;
        if (str.indexOf(".") === -1)
            return false;
        const aliasName = str.split(".")[0];
        const propertyName = str.split(".")[1];
        if (!aliasName || !propertyName)
            return false;
        const aliasNameRegexp = /^[a-zA-Z0-9_-]+$/;
        const propertyNameRegexp = aliasNameRegexp;
        if (!aliasNameRegexp.test(aliasName) || !propertyNameRegexp.test(propertyName))
            return false;
        return true;
    }
}
//# sourceMappingURL=QueryBuilder.js.map