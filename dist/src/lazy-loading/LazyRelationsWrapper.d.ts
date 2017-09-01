import { RelationMetadata } from "../metadata/RelationMetadata";
import { Connection } from "../connection/Connection";
export declare class LazyRelationsWrapper {
    private connection;
    constructor(connection: Connection);
    wrap(object: Object, relation: RelationMetadata): void;
}
