import { RelationMetadata } from "../../metadata/RelationMetadata";
/**
 */
export declare class UpdateByInverseSideOperation {
    entityTarget: Function | string;
    fromEntityTarget: Function | string;
    operationType: "update" | "remove";
    targetEntity: any;
    fromEntity: any;
    fromRelation: RelationMetadata;
    constructor(entityTarget: Function | string, fromEntityTarget: Function | string, operationType: "update" | "remove", targetEntity: any, fromEntity: any, fromRelation: RelationMetadata);
}
