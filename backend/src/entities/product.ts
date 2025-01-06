import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from "typeorm";
import { Cart } from "./cart";
import { OrderItem } from "./orderItem";


@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "text" })
  imageURL: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ type: "int" })
  stock: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({type: "varchar", nullable: true})
  category: string;

  //multiple cart Item can belong to one product.
  @OneToMany(() => Cart, cart => cart.product)
  carts: Cart[];

  //one product can be ordered more than one time.
  @OneToMany(() => OrderItem, order_item => order_item.product)
  orderItem: OrderItem[];
}