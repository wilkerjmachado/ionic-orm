/**
 */
export class UsingJoinTableOnlyOnOneSideAllowedError extends Error {
    constructor(entityMetadata, relation) {
        super();
        this.name = "UsingJoinTableOnlyOnOneSideAllowedError";
        this.message = `Using JoinTable is allowed only on one side of the many-to-many relationship. ` +
            `Both ${entityMetadata.name}#${relation.propertyName} and ${relation.inverseEntityMetadata.name}#${relation.inverseRelation.propertyName} ` +
            `has JoinTable decorators. Choose one of them and left JoinColumn decorator only on it.`;
    }
}
//# sourceMappingURL=UsingJoinTableOnlyOnOneSideAllowedError.js.map