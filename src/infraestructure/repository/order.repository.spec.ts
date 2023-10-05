import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../db/sequelize/model/customer.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import OrderModel from "../db/sequelize/model/order.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import ProductModel from "../db/sequelize/model/product.model";
import ProductRepository from "./product.repository";
import Product from "../../domain/entity/product";
import OrderItem from "../../domain/entity/order_item";
import Order from "../../domain/entity/order";
import OrderRepository from "./order.respository";

describe("Order repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });
        sequelize.addModels([CustomerModel,OrderModel, OrderItemModel, ProductModel ]);
        await sequelize.sync();
    });
    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a new order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "customer 1");
        const address = new Address("Rua 12",12,"32441455","Ceilandia");
        customer.changeAddress(address);
        await customerRepository.create(customer);
        
        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("123", customer.id,[orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: {
                id: order.id
            },
            include: ["items"]
        })

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "123",
                    product_id: product.id
                },
            ],
        });
    });

    it("should update a Order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "customer 1");
        const address = new Address("Rua 12",12,"32441455","Ceilandia");
        customer.changeAddress(address);
        const customer2 = new Customer("2", "customer 2");
        customer2.changeAddress(address);

        await customerRepository.create(customer);
        await customerRepository.create(customer2);
        
        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("123", customer.id,[orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);
        order.changeCustomer(customer2.id);
        await orderRepository.update(order);
        const orderModel = await OrderModel.findOne({
            where: {
                id: order.id
            },
            include: ["items"]
        })

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: customer2.id,
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "123",
                    product_id: product.id
                },
            ],
        });
    })

    it("should find all Orders", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "customer 1");
        const address = new Address("Rua 12",12,"32441455","Ceilandia");
        customer.changeAddress(address);
        await customerRepository.create(customer);
        
        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 100);
        const product2 = new Product("2", "Product 2", 200);
        await productRepository.create(product);
        await productRepository.create(product2);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );
        const orderItem2 = new OrderItem(
            "2",
            product2.name,
            product2.price,
            product2.id,
            1
        );
        const orderRepository = new OrderRepository();
        const order = new Order("123", customer.id,[orderItem, orderItem2]);
        await orderRepository.create(order);
        const foundOrders = await orderRepository.findAll();
        const orders = [order];
        expect(orders).toHaveLength(1);
        expect(orders).toEqual(foundOrders);
    })

    it("should find an Order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "customer 1");
        const address = new Address("Rua 12",12,"32441455","Ceilandia");
        customer.changeAddress(address);
        await customerRepository.create(customer);
        
        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 100);
        const product2 = new Product("2", "Product 2", 200);
        await productRepository.create(product);
        await productRepository.create(product2);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );
        const orderItem2 = new OrderItem(
            "2",
            product2.name,
            product2.price,
            product2.id,
            1
        );
        const orderRepository = new OrderRepository();
        const order = new Order("123", customer.id,[orderItem, orderItem2]);
        await orderRepository.create(order);
        const orderFound = await orderRepository.find(order.id);
        expect(order).toEqual(orderFound);
    })
});