import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Profile } from "./profile";


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

    @OneToOne(() => Profile)
    @JoinColumn()
    profile: Profile

};