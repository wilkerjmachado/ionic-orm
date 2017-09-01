/**
 */
export class RemoveOperation {
    constructor(target, // todo: probably should be metadata here
        entity, entityId, fromMetadata, // todo: use relation.metadata instead?
        relation, fromEntityId) {
        this.target = target;
        this.entity = entity;
        this.entityId = entityId;
        this.fromMetadata = fromMetadata;
        this.relation = relation;
        this.fromEntityId = fromEntityId;
    }
}
//# sourceMappingURL=RemoveOperation.js.map