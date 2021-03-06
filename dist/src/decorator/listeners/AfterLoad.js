import { getMetadataArgsStorage } from "../../../index";
import { EventListenerTypes } from "../../metadata/types/EventListenerTypes";
/**
 * Calls a method on which this decorator is applied after entity is loaded.
 */
export function AfterLoad() {
    return function (object, propertyName) {
        const args = {
            target: object.constructor,
            propertyName: propertyName,
            type: EventListenerTypes.AFTER_LOAD
        };
        getMetadataArgsStorage().entityListeners.add(args);
    };
}
//# sourceMappingURL=AfterLoad.js.map