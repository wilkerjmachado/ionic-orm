import { getMetadataArgsStorage } from "../../../index";
import { EventListenerTypes } from "../../metadata/types/EventListenerTypes";
/**
 * Calls a method on which this decorator is applied before this entity insertion.
 */
export function BeforeInsert() {
    return function (object, propertyName) {
        const args = {
            target: object.constructor,
            propertyName: propertyName,
            type: EventListenerTypes.BEFORE_INSERT
        };
        getMetadataArgsStorage().entityListeners.add(args);
    };
}
//# sourceMappingURL=BeforeInsert.js.map