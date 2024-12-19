import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from "typeorm";
import { Cart } from "./cart";



@Entity()
export class Users{

    @PrimaryGeneratedColumn({type: "int"})
    id: number;

    @Column({type: "varchar"})
    firstname: string;

    @Column({type: "varchar"})
    lastname: string;

    @Column({type: "varchar"})
    email: string;

    @Column({type: "varchar"})
    password: string;

    @Column({type: 'varchar', nullable: true})
    address: string;

    @Column({type: 'numeric', nullable:true})
    phone: number;

    @OneToMany(() => Cart, (cart) => cart.user_id)
    carts: Cart[]
};