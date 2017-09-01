import { Repository } from "./Repository";
import { QueryBuilder } from "../query-builder/QueryBuilder";
/**
 * Repository with additional functions to work with trees.
 *
 * @see Repository
 */
export declare class TreeRepository<Entity> extends Repository<Entity> {
    /**
     * Roots are entities that have no ancestors. Finds them all.
     */
    findRoots(): Promise<Entity[]>;
    /**
     * Creates a query builder used to get descendants of the entities in a tree.
     */
    createDescendantsQueryBuilder(alias: string, closureTableAlias: string, entity: Entity): QueryBuilder<Entity>;
    /**
     * Gets all children (descendants) of the given entity. Returns them all in a flat array.
     */
    findDescendants(entity: Entity): Promise<Entity[]>;
    /**
     * Gets all children (descendants) of the given entity. Returns them in a tree - nested into each other.
     */
    findDescendantsTree(entity: Entity): Promise<Entity>;
    /**
     * Gets number of descendants of the entity.
     */
    countDescendants(entity: Entity): Promise<number>;
    /**
     * Creates a query builder used to get ancestors of the entities in the tree.
     */
    createAncestorsQueryBuilder(alias: string, closureTableAlias: string, entity: Entity): QueryBuilder<Entity>;
    /**
     * Gets all parents (ancestors) of the given entity. Returns them all in a flat array.
     */
    findAncestors(entity: Entity): Promise<Entity[]>;
    /**
     * Gets all parents (ancestors) of the given entity. Returns them in a tree - nested into each other.
     */
    findAncestorsTree(entity: Entity): Promise<Entity>;
    /**
     * Gets number of ancestors of the entity.
     */
    countAncestors(entity: Entity): Promise<number>;
    /**
     * Moves entity to the children of then given entity.
     *
    move(entity: Entity, to: Entity): Promise<void> {
        return Promise.resolve();
    } */
    protected createRelationMaps(alias: string, scalarResults: any[]): {
        id: any;
        parentId: any;
    }[];
    protected buildChildrenEntityTree(entity: any, entities: any[], relationMaps: {
        id: any;
        parentId: any;
    }[]): void;
    protected buildParentEntityTree(entity: any, entities: any[], relationMaps: {
        id: any;
        parentId: any;
    }[]): void;
}
