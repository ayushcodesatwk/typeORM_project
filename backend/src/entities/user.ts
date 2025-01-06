import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Cart } from "./cart";
import { Orders } from "./order";
import { Payments } from "./payment";

@Entity()
export class Users {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    firstname: string;

    @Column({ type: "varchar" })
    lastname: string;

    @Column({ type: "varchar" })
    email: string;

    @Column({ type: "varchar" })
    password: string;

    @Column({ type: 'varchar', nullable: true })
    address: string;

    @Column({ type: 'numeric', nullable: true })
    phone: number;

    @OneToMany(() => Cart, cart => cart.user)
    carts: Cart[];

    @OneToMany(() => Orders, orders => orders.user)
    orders: Orders[];

    //one user can make multiple payments
    @OneToMany(() => Payments, payments => payments.user)
    payments: Payments[];
}