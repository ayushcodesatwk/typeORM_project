import { Column, Decimal128, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product";


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
}