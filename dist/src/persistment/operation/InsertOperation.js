/**
 */
export class InsertOperation {
    constructor(target, // todo: probably should be metadata here
        entity, entityId, // entity ids it should be instead
        date = new Date()) {
        this.target = target;
        this.entity = entity;
        this.entityId = entityId;
        this.date = date;
    }
}
//# sourceMappingURL=InsertOperation.js.map