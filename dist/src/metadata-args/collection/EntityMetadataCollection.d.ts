import { EntityMetadata } from "../../metadata/EntityMetadata";
/**
 * Array for the entity metadatas.
 */
export declare class EntityMetadataCollection extends Array<EntityMetadata> {
    hasTarget(target: Function | string): boolean;
    findByTarget(target: Function | string): EntityMetadata;
    findByName(name: string): EntityMetadata;
    filter(callbackfn: (value: EntityMetadata, index?: number, array?: Array<EntityMetadata>) => any, thisArg?: any): EntityMetadataCollection;
}
