/**
 */
export class OperateEntity {
    constructor(metadata, entity) {
        this.metadata = metadata;
        // todo: check id usage
        this.entity = entity;
        this.entityTarget = metadata.target;
    }
    get id() {
        return this.metadata.getEntityIdMap(this.entity);
    }
    compareId(id) {
        return this.metadata.compareIds(this.id, id);
    }
}
/**
 */
export class PersistOperation {
    constructor() {
        // todo: what if we have two same entities in the insert operations?
        this.inserts = [];
        this.removes = [];
        this.updates = [];
        this.junctionInserts = [];
        this.junctionRemoves = [];
        this.updatesByRelations = [];
        this.updatesByInverseRelations = [];
    }
    log() {
        console.log("---------------------------------------------------------");
        console.log("DB ENTITY");
        console.log("---------------------------------------------------------");
        console.log(this.dbEntity);
        console.log("---------------------------------------------------------");
        console.log("PERSISTENT ENTITY");
        console.log("---------------------------------------------------------");
        console.log(this.persistedEntity);
        console.log("---------------------------------------------------------");
        console.log("DB ENTITIES");
        console.log("---------------------------------------------------------");
        console.log(this.allDbEntities);
        console.log("---------------------------------------------------------");
        console.log("ALL PERSISTENT ENTITIES");
        console.log("---------------------------------------------------------");
        console.log(this.allPersistedEntities);
        console.log("---------------------------------------------------------");
        console.log("INSERTED ENTITIES");
        console.log("---------------------------------------------------------");
        console.log(this.inserts);
        console.log("---------------------------------------------------------");
        console.log("REMOVED ENTITIES");
        console.log("---------------------------------------------------------");
        console.log(this.removes);
        console.log("---------------------------------------------------------");
        console.log("UPDATED ENTITIES");
        console.log("---------------------------------------------------------");
        console.log(this.updates);
        console.log("---------------------------------------------------------");
        console.log("JUNCTION INSERT ENTITIES");
        console.log("---------------------------------------------------------");
        console.log(this.junctionInserts);
        console.log("---------------------------------------------------------");
        console.log("JUNCTION REMOVE ENTITIES");
        console.log("---------------------------------------------------------");
        console.log(this.junctionRemoves);
        console.log("---------------------------------------------------------");
        console.log("UPDATES BY RELATIONS");
        console.log("---------------------------------------------------------");
        console.log(this.updatesByRelations);
        console.log("---------------------------------------------------------");
        console.log("UPDATES BY INVERSE RELATIONS");
        console.log("---------------------------------------------------------");
        console.log(this.updatesByInverseRelations);
        console.log("---------------------------------------------------------");
    }
}
//# sourceMappingURL=PersistOperation.js.map