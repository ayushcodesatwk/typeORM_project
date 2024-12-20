import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Users } from "./user";
import { Product } from "./product";

@Entity()
export class Cart{
    
    @PrimaryGeneratedColumn()
    cartId: number;

    @Column({type: "int", default: 1})
    quantity: number;

    @ManyToOne(() => Users, user => user.carts)
    @JoinColumn({name: 'userId'})
    user: Users;

    @ManyToOne(() => Product, product => product.carts)
    @JoinColumn({ name: "productId" })
    product: Product;
}