import { EntityMetadata } from "../../metadata/EntityMetadata";
/**
 */
export declare class JunctionInsertOperation {
    metadata: EntityMetadata;
    entity1: any;
    entity2: any;
    entity1Target: Function | string;
    entity2Target: Function | string;
    constructor(metadata: EntityMetadata, entity1: any, entity2: any, entity1Target: Function | string, entity2Target: Function | string);
}
