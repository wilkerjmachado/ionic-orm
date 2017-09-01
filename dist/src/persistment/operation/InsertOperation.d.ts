import { ObjectLiteral } from "../../common/ObjectLiteral";
/**
 */
export declare class InsertOperation {
    target: Function | string;
    entity: any;
    entityId: ObjectLiteral | undefined;
    date: Date;
    treeLevel: number;
    constructor(target: Function | string, entity: any, entityId?: ObjectLiteral | undefined, date?: Date);
}
