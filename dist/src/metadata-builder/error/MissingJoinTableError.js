/**
 */
export class MissingJoinTableError extends Error {
    constructor(entityMetadata, relation) {
        super();
        this.name = "MissingJoinTableError";
        if (relation.hasInverseSide) {
            this.message = `JoinTable is missing on both sides of ${entityMetadata.name}#${relation.propertyName} and ` +
                `${relation.inverseEntityMetadata.name}#${relation.inverseRelation.propertyName} many-to-many relationship. ` +
                `You need to put decorator decorator on one of the sides.`;
        }
        else {
            this.message = `JoinTable is missing on ${entityMetadata.name}#${relation.propertyName} many-to-many relationship. ` +
                `You need to put JoinTable decorator on it.`;
        }
    }
}
//# sourceMappingURL=MissingJoinTableError.js.map