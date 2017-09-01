import { TargetMetadataArgsCollection } from "./TargetMetadataArgsCollection";
export class PropertyMetadataArgsCollection extends TargetMetadataArgsCollection {
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    filterRepeatedMetadatas(existsMetadatas) {
        return this.filter(metadata => {
            return !existsMetadatas.find(fieldFromDocument => fieldFromDocument.propertyName === metadata.propertyName);
        });
    }
    findByProperty(propertyName) {
        return this.find(item => item.propertyName === propertyName);
    }
    hasWithProperty(propertyName) {
        return !!this.findByProperty(propertyName);
    }
}
//# sourceMappingURL=PropertyMetadataArgsCollection.js.map