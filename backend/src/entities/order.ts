import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Users } from "./user";
import { Payments } from "./payment";
import { OrderItem } from "./orderItem";

@Entity()
export class Orders {

    //I'm using paymentId as a string 
    //mentioned UUID to make 'id' a string
    //by default it is a number
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "date" })
    orderDate: Date;

    @Column({ type: "decimal" })
    totalPrice: number;

    @ManyToOne(() => Users, user => user.orders)
    @JoinColumn({ name: 'userId' })
    user: Users;

    @ManyToOne(() => Payments, payments => payments.orders)
    @JoinColumn({ name: "paymentId" })
    payment: Payments;

    //cascade will make sure when we delete an order 
    //it'll get deleted from the orderItem table as well
    @OneToMany(() => OrderItem, orders => orders.order)
    orderItem: OrderItem[];
}