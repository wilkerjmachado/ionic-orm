/**
 * JoinColumnMetadata contains all information about relation's join column.
 */
export class JoinColumnMetadata {
    // ---------------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------------
    constructor(args) {
        this.target = args.target;
        this.propertyName = args.propertyName;
        this._name = args.name;
        this.referencedColumnName = args.referencedColumnName;
    }
    // ---------------------------------------------------------------------
    // Accessors
    // ---------------------------------------------------------------------
    /**
     * Join column name.
     */
    get name() {
        return this.relation.entityMetadata.namingStrategy.joinColumnInverseSideName(this._name, this.relation.propertyName);
    }
    /**
     * Referenced join column.
     */
    get referencedColumn() {
        if (this.referencedColumnName) {
            const referencedColumn = this.relation.inverseEntityMetadata.columns.find(column => column.name === this.referencedColumnName);
            if (!referencedColumn)
                throw new Error(`Referenced column ${this.referencedColumnName} was not found in entity ${this.name}`);
        }
        if (this.relation.inverseEntityMetadata.primaryColumns.length > 1)
            throw new Error(`Cannot automatically determine a referenced column of the "${this.relation.inverseEntityMetadata.name}", because it has multiple primary columns. Try to specify a referenced column explicitly.`);
        return this.relation.inverseEntityMetadata.firstPrimaryColumn;
    }
}
//# sourceMappingURL=JoinColumnMetadata.js.map