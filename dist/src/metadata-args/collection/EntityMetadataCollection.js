import { EntityMetadataNotFound } from "../error/EntityMetadataNotFound";
/**
 * Array for the entity metadatas.
 */
export class EntityMetadataCollection extends Array {
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    hasTarget(target) {
        return !!this.find(metadata => metadata.target === target || (typeof target === "string" && metadata.targetName === target));
    }
    findByTarget(target) {
        const metadata = this.find(metadata => metadata.target === target || (typeof target === "string" && metadata.targetName === target));
        if (!metadata)
            throw new EntityMetadataNotFound(target);
        return metadata;
    }
    findByName(name) {
        const metadata = this.find(metadata => metadata.name === name);
        if (!metadata)
            throw new EntityMetadataNotFound(name);
        return metadata;
    }
    filter(callbackfn, thisArg) {
        thisArg = thisArg || void 0;
        return this.reduce(function (out, val, index, array) {
            if (callbackfn.call(thisArg, val, index, array)) {
                out.push(val);
            }
            return out;
        }, new EntityMetadataCollection());
    }
}
//# sourceMappingURL=EntityMetadataCollection.js.map