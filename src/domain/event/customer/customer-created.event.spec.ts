import EventDispatcher from "../@shared/event-dispatcher";
import CustomerCreatedEvent from "./customer-created.events";
import PrintConsole1CustomerCreatedHandler from "./handler/enviar-console-log-1-customer-created";
import PrintConsole2CustomerCreatedHandler from "./handler/enviar-console-log-2-customer-created";

describe("Customer created event tests", () => {
    
    it("should notify the event handlers of the creation of a customer", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new PrintConsole1CustomerCreatedHandler();
        const eventHandler2 = new PrintConsole2CustomerCreatedHandler();
        
        const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
        const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");
    
        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
        
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
    
        const customerCreatedEvent = new CustomerCreatedEvent({
            id: "1",
            name: "Client 1",
            active: true
        })
    
        eventDispatcher.notify(customerCreatedEvent);
    
        expect(spyEventHandler1).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();
    });    
})