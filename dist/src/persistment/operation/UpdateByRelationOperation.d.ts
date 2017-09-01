import { InsertOperation } from "./InsertOperation";
import { RelationMetadata } from "../../metadata/RelationMetadata";
/**
 */
export declare class UpdateByRelationOperation {
    entityTarget: Function | string;
    targetEntity: any;
    insertOperation: InsertOperation;
    updatedRelation: RelationMetadata;
    constructor(entityTarget: Function | string, targetEntity: any, insertOperation: InsertOperation, updatedRelation: RelationMetadata);
}
