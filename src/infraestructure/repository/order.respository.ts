import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface {

    async create(entity: Order): Promise<void> {
        
        await OrderModel.create({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                product_id: item.productId,
            })),
        },
        {
            include: [{ model: OrderItemModel }]
        }
        );
    }
    async update(entity: Order): Promise<void> {
        await OrderModel.update(
            {
                id: entity.id,
                customer_id: entity.customerId,
                total: entity.total(),
                items: entity.items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    product_id: item.productId,
                })),
            },
            {
                where: {
                    id: entity.id
                },
            }
        )
    }
	async find(id: string): Promise<Order> {
		let ordersBD;

		try {
			ordersBD = await OrderModel.findOne({
				where: { id },
				include: [{ model: OrderItemModel }],
				rejectOnEmpty: true,
			});
		} catch (error) {
			throw new Error(`Order with id: ${id} not found`);
		}

		const items = ordersBD.items.map((item) =>
        new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
        );
		const order = new Order(ordersBD.id, ordersBD.customer_id, items);

		return order;
	}

    async findAll(): Promise<Order[]> {
		const ordersBD = await OrderModel.findAll({ include: [{ model: OrderItemModel }] });

		const orders = ordersBD.map((ordersBD) => {
			const items = ordersBD.items.map((item) =>
                new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
            );
			const order = new Order(ordersBD.id, ordersBD.customer_id, items);

			return order;
		});

		return orders;
	}
}