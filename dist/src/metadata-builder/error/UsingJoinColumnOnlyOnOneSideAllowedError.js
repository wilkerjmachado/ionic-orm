/**
 */
export class UsingJoinColumnOnlyOnOneSideAllowedError extends Error {
    constructor(entityMetadata, relation) {
        super();
        this.name = "UsingJoinColumnOnlyOnOneSideAllowedError";
        this.message = `Using JoinColumn is allowed only on one side of the one-to-one relationship. ` +
            `Both ${entityMetadata.name}#${relation.propertyName} and ${relation.inverseEntityMetadata.name}#${relation.inverseRelation.propertyName} ` +
            `has JoinTable decorators. Choose one of them and left JoinTable decorator only on it.`;
    }
}
//# sourceMappingURL=UsingJoinColumnOnlyOnOneSideAllowedError.js.map