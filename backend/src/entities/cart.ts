import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";


@Entity()
export class Cart{
    
    @PrimaryGeneratedColumn()
    cart_id: number;

    @Column({type: "int"})
    quantity: number;

    @Column({type: "int"})
    customer_id: number;

    @Column({type: 'int'})
    product_id: number;

}