import EventHandlerInterface from "../../@shared/event-handler.interface";
import { CustomerChangedAddressEvent } from "../customer-changed-address";



export class EnviarConsoleLogAddressHandler implements EventHandlerInterface<CustomerChangedAddressEvent> {
    handle(event: CustomerChangedAddressEvent): void {
        console.log(`
            Endereço do cliente: ${event.eventData.id}, 
            ${event.eventData.name} alterado para: 
            ${event.eventData.newAddress.street} - 
            ${event.eventData.newAddress.number} -
            ${event.eventData.newAddress.city} -
            ${event.eventData.newAddress.zipcode}
            ".
        `);
    }
}