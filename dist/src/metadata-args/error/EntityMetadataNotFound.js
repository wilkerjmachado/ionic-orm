/**
 */
export class EntityMetadataNotFound extends Error {
    constructor(target) {
        super();
        this.name = "EntityMetadataNotFound";
        const targetName = typeof target === "function" && target.name ? target.name : target;
        this.message = `No metadata for "${targetName}" was found.`;
    }
}
//# sourceMappingURL=EntityMetadataNotFound.js.map