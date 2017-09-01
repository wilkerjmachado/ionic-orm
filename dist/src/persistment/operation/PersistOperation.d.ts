import { InsertOperation } from "./InsertOperation";
import { RemoveOperation } from "./RemoveOperation";
import { UpdateOperation } from "./UpdateOperation";
import { JunctionInsertOperation } from "./JunctionInsertOperation";
import { JunctionRemoveOperation } from "./JunctionRemoveOperation";
import { UpdateByRelationOperation } from "./UpdateByRelationOperation";
import { UpdateByInverseSideOperation } from "./UpdateByInverseSideOperation";
import { EntityMetadata } from "../../metadata/EntityMetadata";
import { ObjectLiteral } from "../../common/ObjectLiteral";
/**
 */
export declare class OperateEntity {
    metadata: EntityMetadata;
    entityTarget: Function | string;
    entity: any;
    constructor(metadata: EntityMetadata, entity: ObjectLiteral);
    readonly id: ObjectLiteral | undefined;
    compareId(id: ObjectLiteral): boolean;
}
/**
 */
export declare class PersistOperation {
    dbEntity?: OperateEntity;
    persistedEntity: OperateEntity;
    allDbEntities: OperateEntity[];
    allPersistedEntities: OperateEntity[];
    inserts: InsertOperation[];
    removes: RemoveOperation[];
    updates: UpdateOperation[];
    junctionInserts: JunctionInsertOperation[];
    junctionRemoves: JunctionRemoveOperation[];
    updatesByRelations: UpdateByRelationOperation[];
    updatesByInverseRelations: UpdateByInverseSideOperation[];
    log(): void;
}
