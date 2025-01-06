import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Users } from "./user";
import { Payments } from "./payment";

@Entity()
export class Orders {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "date" })
    order_date: Date;

    @Column({ type: "decimal" })
    total_price: number;

    @ManyToOne(() => Users, user => user.orders)
    @JoinColumn({ name: 'userId' })
    user: Users;

    @ManyToOne(() => Payments, payments => payments.orders)
    @JoinColumn({ name: "paymentId" })
    payment: Payments;
}