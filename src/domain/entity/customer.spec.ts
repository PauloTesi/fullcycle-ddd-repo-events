import Address from './address';
import Customer from './customer';

describe("Customer unit testes", () => {

    it("should throw error when id is empty", () => {
        expect(() => {
            let customer = new Customer("","Paulo");
            ;
        }).toThrowError("Id is required");
    });
    it("should throw error when name is empty", () => {
        expect(() => {
            let customer = new Customer("123","");
            ;
        }).toThrowError("Name is required");
    });
    it("should change name", () => {
        // Arrange
        const customer = new Customer("123","Paulo");
        // Act
        customer.changeName("Bernardo");
        // Assert
        expect(customer.name).toBe("Bernardo");
    });
    it("should activate customer", () => {
        // Arrange
        const customer = new Customer("123","Paulo");
        const address = new Address("Rua 1", 1, "72210220", "Ceilandia");
        customer.address = address;
        // Act
        customer.activate();
        // Assert
        expect(customer.isActive()).toBe(true);
    });
    it("should throw error when address is undefined when you activate a customer", () => {
        expect(() => {
            const customer = new Customer("123","Paulo");
            customer.activate();
        }).toThrowError("Address is mandatory to activate a customer")
    });
    it("should deActivate customer", () => {
        const customer = new Customer("123","Paulo");
        customer.deactivate();
        expect(customer.isActive()).toBe(false);
    });

    it("should add reward points", () => {
        const customer = new Customer("123","Paulo");
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);
    })


})