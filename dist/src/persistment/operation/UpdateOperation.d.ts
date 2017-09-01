import { ColumnMetadata } from "../../metadata/ColumnMetadata";
import { RelationMetadata } from "../../metadata/RelationMetadata";
import { ObjectLiteral } from "../../common/ObjectLiteral";
/**
 */
export declare class UpdateOperation {
    target: Function | string;
    entity: any;
    entityId: ObjectLiteral;
    columns: ColumnMetadata[];
    relations: RelationMetadata[];
    date: Date;
    constructor(target: Function | string, entity: any, entityId: ObjectLiteral, columns: ColumnMetadata[], relations: RelationMetadata[], date?: Date);
}
