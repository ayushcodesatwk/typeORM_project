import { Column, Decimal128, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product";
import { Orders } from "./order";


@Entity()
export class OrderItem{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type: "int"})
    quantity: number;

    @Column({type: "decimal"})
    price: Decimal128;

    @ManyToOne(() => Product, product => product.orderItem)
    @JoinColumn({name: "productId"})
    product: Product

    @ManyToOne(() => Orders, orders => orders.orderItem, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({name: "orderId"})
    order: Orders
}