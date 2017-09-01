/**
 */
export class CascadesNotAllowedError extends Error {
    constructor(type, metadata, relation) {
        super();
        this.name = "CascadesNotAllowedError";
        this.message = `Cascades (${type}) are not allowed for the given relation ${metadata.name}#${relation.name}`;
    }
}
//# sourceMappingURL=CascadesNotAllowedError.js.map