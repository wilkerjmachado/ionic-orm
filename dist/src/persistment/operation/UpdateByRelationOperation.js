/**
 */
export class UpdateByRelationOperation {
    constructor(entityTarget, // todo: probably must be entity metadata here?
        targetEntity, insertOperation, updatedRelation) {
        this.entityTarget = entityTarget;
        this.targetEntity = targetEntity;
        this.insertOperation = insertOperation;
        this.updatedRelation = updatedRelation;
    }
}
//# sourceMappingURL=UpdateByRelationOperation.js.map