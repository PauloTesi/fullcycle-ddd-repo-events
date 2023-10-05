import EventDispatcher from "../@shared/event-dispatcher";
import { CustomerChangedAddressEvent } from "./customer-changed-address";
import { EnviarConsoleLogAddressHandler } from "./handler/enviar-log-address-handler";

describe("Customer changed of address event tests", () => {
    
    it("should notify the event handlers of the change of a customer", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new EnviarConsoleLogAddressHandler();
        
        const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    
        eventDispatcher.register("CustomerChangedAddressEvent", eventHandler1);
        
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"].length).toBe(1);
    
        const customerChangeAddressEvent = new CustomerChangedAddressEvent({
            id: "1",
            name: "Client 1",
            active: true,
            oldAddress: {
                street: "Rua 1",
                number: "1",
                city: "Brasilia",
                zipcode: "252524558"
            },
            newAddress: {
                street: "Rua 2",
                number: "2",
                city: "Sao paulo",
                zipcode: "010251554"
            },
        })
    
        eventDispatcher.notify(customerChangeAddressEvent);
    
        expect(spyEventHandler1).toHaveBeenCalled();
    });    
})