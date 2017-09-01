import { getMetadataArgsStorage } from "../../../index";
/**
 * Classes decorated with this decorator will listen to ORM events and their methods will be triggered when event
 * occurs. Those classes must implement EventSubscriberInterface interface.
 */
export function EventSubscriber() {
    return function (target) {
        const args = {
            target: target
        };
        getMetadataArgsStorage().entitySubscribers.add(args);
    };
}
//# sourceMappingURL=EventSubscriber.js.map