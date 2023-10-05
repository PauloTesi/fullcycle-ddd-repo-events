import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../db/sequelize/model/customer.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";

describe("Customer repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });
        sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    });
    afterEach(async () => {
        await sequelize.close();
    });
    it("should create a Customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "customer 1");
        const address = new Address("Rua 12",12,"32441455","Ceilandia");
        customer.address = address;

        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne( {where: { id: "1"}  } );

        expect(customerModel.toJSON()).toStrictEqual({
            id: "1",
            name: "customer 1",
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: address.street,
            number: address.number,
            zipcode: address.zip,
            city: address.city
        });
    });

    it("should update a Costumer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "customer 1");
        const address = new Address("Rua 12",12,"32441455","Ceilandia");
        customer.address = address;

        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne( {where: { id: "1"}  } );

        customer.changeName("customer 2");

        await customerRepository.update(customer);

        const customerModel2 = await CustomerModel.findOne({ where: { id: "1" } });

        expect (customerModel2.toJSON()).toStrictEqual({
            id: "1",
            name: "customer 2",
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: address.street,
            number: address.number,
            zipcode: address.zip,
            city: address.city
        });

    })

    it("should find a Costumer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "customer 1");
        const address = new Address("Rua 12",12,"32441455","Ceilandia");
        customer.address = address;
        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne( {where: { id: "1"}  } );

        const foundcustomer = await customerRepository.find("1");

        expect(customerModel.toJSON()).toStrictEqual({
            id: foundcustomer.id,
            name: foundcustomer.name,
            active: foundcustomer.isActive(),
            rewardPoints: foundcustomer.rewardPoints,
            street: foundcustomer.address.street,
            number: foundcustomer.address.number,
            zipcode: foundcustomer.address.zip,
            city: foundcustomer.address.city
        })

    })

    it("!should throw an error when customer is not found", async () => {
        const customerRepository = new CustomerRepository();

        expect(async () => {
            await customerRepository.find("454ss545");
        }).rejects.toThrow("Customer not found");
    })

    it("should find all Costumers", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Rua 12",12,"32441455","Ceilandia");
        customer.address = address;
        customer.addRewardPoints(10);
        customer.activate();
        const customer2 = new Customer("2", "Customer 2");
        customer2.address = address;
        customer2.addRewardPoints(20);
        customer2.activate();
        
        await customerRepository.create(customer);
        await customerRepository.create(customer2);

        const customers = await customerRepository.findAll();

        expect(customers).toHaveLength(2);
        expect(customers).toContainEqual(customer);
        expect(customers).toContainEqual(customer2);

    })

});