import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit testes", () => {

    it("should throw error when id is empty", () => {
        expect(() => {
            let order = new Order("", "123", []);
        }).toThrowError("Id is required");
    });
    it("should throw error when customerId is empty", () => {
        expect(() => {
            let order = new Order("1", "", []);
        }).toThrowError("CustomerId is required");
    });
    it("should throw error when items is empty", () => {
        expect(() => {
            let order = new Order("1", "123", []);
        }).toThrowError("Item qtd must be grater than 0");
    });
    it("should calculate total", () => {
        const item1 = new OrderItem("i1", "item1", 10, "p1", 2);
        const item2 = new OrderItem("i2", "item2", 20, "p2", 2);
        const order = new Order("o1","c1",[item1,item2]);
        const total = order.total();
        expect(total).toBe(60);
    });
    it("should throw error if the item qtd is less or equal 0", () => {
        expect(() => {
            const item1 = new OrderItem("i1", "item1", 10, "p1", 0);
            const order = new Order("o1","c1",[item1]);
        }).toThrowError("Quantity must be greater than 0");
    });
})