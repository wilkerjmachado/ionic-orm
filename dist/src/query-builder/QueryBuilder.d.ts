import { Alias } from "./alias/Alias";
import { AliasMap } from "./alias/AliasMap";
import { EntityMetadata } from "../metadata/EntityMetadata";
import { ObjectLiteral } from "../common/ObjectLiteral";
import { QueryRunner } from "../query-runner/QueryRunner";
import { OrderByCondition } from "../find-options/OrderByCondition";
import { Connection } from "../connection/Connection";
/**
 */
export interface Join {
    alias: Alias;
    type: "LEFT" | "INNER";
    conditionType: "ON" | "WITH";
    condition?: string;
    tableName: string;
    mapToProperty?: string;
    isMappingMany: boolean;
}
export interface JoinRelationId {
    alias: Alias;
    type: "LEFT" | "INNER";
    conditionType: "ON" | "WITH";
    condition?: string;
    mapToProperty?: string;
}
export interface RelationCountMeta {
    alias: Alias;
    conditionType: "ON" | "WITH";
    condition?: string;
    mapToProperty?: string;
    entities: {
        entity: any;
        metadata: EntityMetadata;
    }[];
}
/**
 */
export interface JoinMapping {
    type: "join" | "relationId";
    alias: Alias;
    parentName: string;
    propertyName: string;
    isMany: boolean;
}
/**
 * Allows to build complex sql queries in a fashion way and execute those queries.
 */
export declare class QueryBuilder<Entity> {
    protected connection: Connection;
    protected queryRunner: QueryRunner | undefined;
    protected aliasMap: AliasMap;
    protected type: "select" | "update" | "delete";
    protected selects: string[];
    protected fromEntity: {
        alias: Alias;
    };
    protected fromTableName: string;
    protected fromTableAlias: string;
    protected updateQuerySet: Object;
    protected joins: Join[];
    protected joinRelationIds: JoinRelationId[];
    protected relationCountMetas: RelationCountMeta[];
    protected groupBys: string[];
    protected wheres: {
        type: "simple" | "and" | "or";
        condition: string;
    }[];
    protected havings: {
        type: "simple" | "and" | "or";
        condition: string;
    }[];
    protected orderBys: OrderByCondition;
    protected parameters: ObjectLiteral;
    protected limit: number;
    protected offset: number;
    protected firstResult: number;
    protected maxResults: number;
    protected ignoreParentTablesJoins: boolean;
    constructor(connection: Connection, queryRunner?: QueryRunner | undefined);
    /**
     * Gets the main alias string used in this query builder.
     */
    readonly alias: string;
    /**
     * Creates DELETE query.
     */
    delete(): this;
    /**
     * Creates DELETE query for the given entity.
     */
    delete(entityTarget: Function | string): this;
    /**
     * Creates DELETE query for the given table name.
     */
    delete(tableName: string): this;
    /**
     * Creates UPDATE query and applies given update values.
     */
    update(updateSet: ObjectLiteral): this;
    /**
     * Creates UPDATE query for the given entity and applies given update values.
     */
    update(entity: Function, updateSet: ObjectLiteral): this;
    /**
     * Creates UPDATE query for the given table name and applies given update values.
     */
    update(tableName: string, updateSet: ObjectLiteral): this;
    /**
     * Creates SELECT query.
     * Replaces all old selections if they exist.
     */
    select(): this;
    /**
     * Creates SELECT query and selects given data.
     * Replaces all old selections if they exist.
     */
    select(selection: string): this;
    /**
     * Creates SELECT query and selects given data.
     * Replaces all old selections if they exist.
     */
    select(selection: string[]): this;
    /**
     * Creates SELECT query and selects given data.
     * Replaces all old selections if they exist.
     */
    select(...selection: string[]): this;
    /**
     * Adds new selection to the SELECT query.
     */
    addSelect(selection: string): this;
    /**
     * Adds new selection to the SELECT query.
     */
    addSelect(selection: string[]): this;
    /**
     * Adds new selection to the SELECT query.
     */
    addSelect(...selection: string[]): this;
    /**
     * Specifies FROM which table select/update/delete will be executed.
     * Also sets a main string alias of the selection data.
     */
    from(tableName: string, alias: string): this;
    /**
     * Specifies FROM which entity's table select/update/delete will be executed.
     * Also sets a main string alias of the selection data.
     */
    from(entity: Function | string, alias: string): this;
    /**
     * INNER JOINs (without selection) entity's property.
     * Given entity property should be a relation.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoin(property: string, alias: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * INNER JOINs (without selection) given entity's table.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoin(entity: Function | string, alias: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * INNER JOINs (without selection) given table.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoin(tableName: string, alias: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * LEFT JOINs (without selection) entity's property.
     * Given entity property should be a relation.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoin(property: string, alias: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * LEFT JOINs (without selection) entity's table.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoin(entity: Function | string, alias: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * LEFT JOINs (without selection) given table.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoin(tableName: string, alias: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * INNER JOINs entity's property and adds all selection properties to SELECT.
     * Given entity property should be a relation.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndSelect(property: string, alias: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * INNER JOINs entity and adds all selection properties to SELECT.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndSelect(entity: Function | string, alias: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * INNER JOINs table and adds all selection properties to SELECT.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndSelect(tableName: string, alias: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * LEFT JOINs entity's property and adds all selection properties to SELECT.
     * Given entity property should be a relation.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndSelect(property: string, alias: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * LEFT JOINs entity and adds all selection properties to SELECT.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndSelect(entity: Function | string, alias: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * LEFT JOINs table and adds all selection properties to SELECT.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndSelect(tableName: string, alias: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * INNER JOINs entity's property, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there are multiple rows of selecting data, and mapped result will be an array.
     * Given entity property should be a relation.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndMapMany(mapToProperty: string, property: string, alias: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * INNER JOINs entity's table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there are multiple rows of selecting data, and mapped result will be an array.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndMapMany(mapToProperty: string, entity: Function | string, alias: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * INNER JOINs table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there are multiple rows of selecting data, and mapped result will be an array.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndMapMany(mapToProperty: string, tableName: string, alias: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * INNER JOINs entity's property, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
     * Given entity property should be a relation.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndMapOne(mapToProperty: string, property: string, alias: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * INNER JOINs entity's table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndMapOne(mapToProperty: string, entity: Function | string, alias: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * INNER JOINs table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndMapOne(mapToProperty: string, tableName: string, alias: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * LEFT JOINs entity's property, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there are multiple rows of selecting data, and mapped result will be an array.
     * Given entity property should be a relation.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndMapMany(mapToProperty: string, property: string, alias: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * LEFT JOINs entity's table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there are multiple rows of selecting data, and mapped result will be an array.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndMapMany(mapToProperty: string, entity: Function | string, alias: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * LEFT JOINs table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there are multiple rows of selecting data, and mapped result will be an array.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndMapMany(mapToProperty: string, tableName: string, alias: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * LEFT JOINs entity's property, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
     * Given entity property should be a relation.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndMapOne(mapToProperty: string, property: string, alias: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * LEFT JOINs entity's table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndMapOne(mapToProperty: string, entity: Function | string, alias: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * LEFT JOINs table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndMapOne(mapToProperty: string, tableName: string, alias: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * LEFT JOINs relation id.
     * Optionally, you can add condition and parameters used in condition.
     *
     * @experimental
     */
    leftJoinRelationId(property: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * INNER JOINs relation id.
     * Optionally, you can add condition and parameters used in condition.
     *
     * @experimental
     */
    innerJoinRelationId(property: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * LEFT JOINs relation id and maps it into some entity's property.
     * Optionally, you can add condition and parameters used in condition.
     *
     * @experimental
     */
    leftJoinRelationIdAndMap(mapToProperty: string, property: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * INNER JOINs relation id and maps it into some entity's property.
     * Optionally, you can add condition and parameters used in condition.
     *
     * @experimental
     */
    innerJoinRelationIdAndMap(mapToProperty: string, property: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * Counts number of entities of entity's relation.
     * Optionally, you can add condition and parameters used in condition.
     *
     * @experimental
     */
    countRelation(property: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * Counts number of entities of entity's relation and maps the value into some entity's property.
     * Optionally, you can add condition and parameters used in condition.
     *
     * @experimental
     */
    countRelationAndMap(mapProperty: string, property: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    /**
     * Sets WHERE condition in the query builder.
     * If you had previously WHERE expression defined,
     * calling this function will override previously set WHERE conditions.
     * Additionally you can add parameters used in where expression.
     */
    where(where: string, parameters?: ObjectLiteral): this;
    /**
     * Adds new AND WHERE condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    andWhere(where: string, parameters?: ObjectLiteral): this;
    /**
     * Adds new OR WHERE condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    orWhere(where: string, parameters?: ObjectLiteral): this;
    /**
     * Sets HAVING condition in the query builder.
     * If you had previously HAVING expression defined,
     * calling this function will override previously set HAVING conditions.
     * Additionally you can add parameters used in where expression.
     */
    having(having: string, parameters?: ObjectLiteral): this;
    /**
     * Adds new AND HAVING condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    andHaving(having: string, parameters?: ObjectLiteral): this;
    /**
     * Adds new OR HAVING condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    orHaving(having: string, parameters?: ObjectLiteral): this;
    /**
     * Sets GROUP BY condition in the query builder.
     * If you had previously GROUP BY expression defined,
     * calling this function will override previously set GROUP BY conditions.
     */
    groupBy(groupBy: string): this;
    /**
     * Adds GROUP BY condition in the query builder.
     */
    addGroupBy(groupBy: string): this;
    /**
     * Sets ORDER BY condition in the query builder.
     * If you had previously ORDER BY expression defined,
     * calling this function will override previously set ORDER BY conditions.
     */
    orderBy(sort: string, order?: "ASC" | "DESC"): this;
    /**
     * Adds ORDER BY condition in the query builder.
     */
    addOrderBy(sort: string, order?: "ASC" | "DESC"): this;
    /**
     * Set's LIMIT - maximum number of rows to be selected.
     * NOTE that it may not work as you expect if you are using joins.
     * If you want to implement pagination, and you are having join in your query,
     * then use instead setMaxResults instead.
     */
    setLimit(limit: number): this;
    /**
     * Set's OFFSET - selection offset.
     * NOTE that it may not work as you expect if you are using joins.
     * If you want to implement pagination, and you are having join in your query,
     * then use instead setFirstResult instead.
     */
    setOffset(offset: number): this;
    /**
     * Set's maximum number of entities to be selected.
     */
    setMaxResults(maxResults: number): this;
    /**
     * Set's offset of entities to be selected.
     */
    setFirstResult(firstResult: number): this;
    /**
     * Sets given parameter's value.
     */
    setParameter(key: string, value: any): this;
    /**
     * Sets given object literal as parameters.
     * Note, that it clears all previously set parameters.
     */
    setParameters(parameters: ObjectLiteral): this;
    /**
     * Adds all parameters from the given object.
     * Unlike setParameters method it does not clear all previously set parameters.
     */
    addParameters(parameters: ObjectLiteral): this;
    /**
     * Gets all parameters.
     */
    getParameters(): ObjectLiteral;
    /**
     * Gets generated sql that will be executed.
     * Parameters in the query are escaped for the currently used driver.
     */
    getSql(): string;
    /**
     * Gets generated sql without parameters being replaced.
     *
     * @experimental
     */
    getGeneratedQuery(): string;
    /**
     * Gets sql to be executed with all parameters used in it.
     *
     * @experimental
     */
    getSqlWithParameters(options?: {
        skipOrderBy?: boolean;
    }): [string, any[]];
    /**
     * Executes sql generated by query builder and returns raw database results.
     */
    execute(): Promise<any>;
    /**
     * Executes sql generated by query builder and returns object with scalar results and entities created from them.
     */
    getResultsAndScalarResults(): Promise<{
        entities: Entity[];
        scalarResults: any[];
    }>;
    /**
     * Gets count - number of entities selected by sql generated by this query builder.
     * Count excludes all limitations set by setFirstResult and setMaxResults methods call.
     */
    getCount(): Promise<number>;
    /**
     * Gets all scalar results returned by execution of generated query builder sql.
     */
    getScalarResults<T>(): Promise<T[]>;
    /**
     * Gets first scalar result returned by execution of generated query builder sql.
     */
    getSingleScalarResult<T>(): Promise<T>;
    /**
     * Gets entities and count returned by execution of generated query builder sql.
     */
    getResultsAndCount(): Promise<[Entity[], number]>;
    /**
     * Gets entities returned by execution of generated query builder sql.
     */
    getResults(): Promise<Entity[]>;
    /**
     * Gets single entity returned by execution of generated query builder sql.
     */
    getSingleResult(): Promise<Entity>;
    /**
     * Clones query builder as it is.
     */
    clone(options?: {
        queryRunner?: QueryRunner;
        skipOrderBys?: boolean;
        skipLimit?: boolean;
        skipOffset?: boolean;
        ignoreParentTablesJoins?: boolean;
    }): QueryBuilder<Entity>;
    protected loadRelationCounts(queryRunner: QueryRunner, results: Entity[]): Promise<{}>;
    protected rawResultsToEntities(results: any[]): any[];
    protected createSelectExpression(): string;
    protected createWhereExpression(): string;
    /**
     * Replaces all entity's propertyName to name in the given statement.
     */
    private replacePropertyNames(statement);
    protected createJoinRelationIdsExpression(): string[];
    protected createJoinExpression(): string;
    protected createGroupByExpression(): string;
    protected createHavingExpression(): string;
    protected createOrderByExpression(): string;
    protected createLimitExpression(): string;
    protected createOffsetExpression(): string;
    private extractJoinMappings();
    protected join(joinType: "INNER" | "LEFT", property: string, alias: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral, mapToProperty?: string, isMappingMany?: boolean): this;
    protected join(joinType: "INNER" | "LEFT", entity: Function, alias: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral, mapToProperty?: string, isMappingMany?: boolean): this;
    protected join(joinType: "INNER" | "LEFT", entityOrProperty: Function | string, alias: string, conditionType: "ON" | "WITH", condition: string, parameters?: ObjectLiteral, mapToProperty?: string, isMappingMany?: boolean): this;
    protected joinRelationId(joinType: "LEFT" | "INNER", mapToProperty: string | undefined, property: string, conditionType?: "ON" | "WITH", condition?: string, parameters?: ObjectLiteral): this;
    private isValueSimpleString(str);
    private isPropertyAlias(str);
}
