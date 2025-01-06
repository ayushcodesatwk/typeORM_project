import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Users } from "./user";
import { Orders } from "./order";

@Entity()
export class Payments {

    @PrimaryGeneratedColumn()
    paymentId: number;

    @Column({ type: "date" })
    paymentDate: Date;

    @Column({ type: "varchar" })
    paymentMethod: string;

    @Column({ type: "decimal" })
    amount: number;

    @OneToMany(() => Orders, order => order.payment)
    orders: Orders[];

    @ManyToOne(() => Users, user => user.payments)
    user: Users;
}