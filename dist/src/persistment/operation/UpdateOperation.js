/**
 */
export class UpdateOperation {
    constructor(target, entity, entityId, columns, relations, date = new Date()) {
        this.target = target;
        this.entity = entity;
        this.entityId = entityId;
        this.columns = columns;
        this.relations = relations;
        this.date = date;
    }
}
//# sourceMappingURL=UpdateOperation.js.map