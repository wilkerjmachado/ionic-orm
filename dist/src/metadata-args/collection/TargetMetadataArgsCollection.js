import { MetadataAlreadyExistsError } from "../../metadata-builder/error/MetadataAlreadyExistsError";
export class TargetMetadataArgsCollection extends Array {
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    filter(callbackfn, thisArg) {
        const collection = new this.constructor();
        super.filter(callbackfn)
            .forEach(metadata => collection.add(metadata));
        return collection;
    }
    filterByTarget(cls) {
        // if no class specified then simply return empty collection
        if (!cls)
            return new this.constructor();
        return this.filterByTargets([cls]);
    }
    filterByTargets(classes) {
        return this.filter(metadata => {
            if (!metadata.target)
                return false;
            return classes.indexOf(metadata.target) !== -1;
        });
    }
    add(metadata, checkForDuplicateTargets = false) {
        if (checkForDuplicateTargets) {
            if (!metadata.target || !(metadata.target instanceof Function))
                throw new Error(`Target is not set in the given metadata.`);
            if (this.hasWithTarget(metadata.target))
                throw new MetadataAlreadyExistsError(metadata.constructor.name, metadata.target);
        }
        this.push(metadata);
    }
    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------
    hasWithTarget(constructor) {
        return !!this.find(metadata => metadata.target === constructor);
    }
}
//# sourceMappingURL=TargetMetadataArgsCollection.js.map