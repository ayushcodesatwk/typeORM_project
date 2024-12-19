import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Users } from "./user";
import { Product } from "./product";

@Entity()
export class Cart{
    
    @PrimaryGeneratedColumn()
    cart_id: number;

    @Column({type: "int"})
    quantity: number;

    @ManyToOne(() => Users, user => user.carts)
    @JoinColumn({name: 'user_id'})
    user: Users;

    @Column({type: "int"})
    customer_id: number;

    @ManyToOne(() => Product, product => product.carts)
    @JoinColumn({ name: "product_id" })
    product: Product[];

}