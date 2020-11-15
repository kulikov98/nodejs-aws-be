import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Stock} from "./index";

@Entity({
    name: 'products'
})
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column()
    price: number;

    @OneToOne('Stock', 'product')
    stock: Stock;

    count: Stock;
}