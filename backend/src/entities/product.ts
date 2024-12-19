import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from "typeorm";
import { Cart } from "./cart";


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
}