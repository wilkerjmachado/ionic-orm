/**
 */
export class MissingJoinColumnError extends Error {
    constructor(entityMetadata, relation) {
        super();
        this.name = "MissingJoinColumnError";
        if (relation.hasInverseSide) {
            this.message = `JoinColumn is missing on both sides of ${entityMetadata.name}#${relation.propertyName} and ` +
                `${relation.inverseEntityMetadata.name}#${relation.inverseRelation.propertyName} one-to-one relationship. ` +
                `You need to put JoinColumn decorator on one of the sides.`;
        }
        else {
            this.message = `JoinColumn is missing on ${entityMetadata.name}#${relation.propertyName} one-to-one relationship. ` +
                `You need to put JoinColumn decorator on it.`;
        }
    }
}
//# sourceMappingURL=MissingJoinColumnError.js.map