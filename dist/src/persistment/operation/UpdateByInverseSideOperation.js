/**
 */
export class UpdateByInverseSideOperation {
    constructor(entityTarget, // todo: probably must be entity metadata here?
        fromEntityTarget, operationType, targetEntity, fromEntity, fromRelation) {
        this.entityTarget = entityTarget;
        this.fromEntityTarget = fromEntityTarget;
        this.operationType = operationType;
        this.targetEntity = targetEntity;
        this.fromEntity = fromEntity;
        this.fromRelation = fromRelation;
    }
}
//# sourceMappingURL=UpdateByInverseSideOperation.js.map