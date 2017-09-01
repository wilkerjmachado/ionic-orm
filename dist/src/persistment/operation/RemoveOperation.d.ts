import { RelationMetadata } from "../../metadata/RelationMetadata";
import { EntityMetadata } from "../../metadata/EntityMetadata";
import { ObjectLiteral } from "../../common/ObjectLiteral";
/**
 */
export declare class RemoveOperation {
    target: Function | string;
    entity: any;
    entityId: ObjectLiteral;
    fromMetadata: EntityMetadata;
    relation: RelationMetadata | undefined;
    fromEntityId: ObjectLiteral | undefined;
    constructor(target: Function | string, entity: any, entityId: ObjectLiteral, fromMetadata: EntityMetadata, relation: RelationMetadata | undefined, fromEntityId: ObjectLiteral | undefined);
}
