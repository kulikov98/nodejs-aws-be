import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {IStock} from "./types/IStock";
import {IProduct} from "./types/IProduct";


@Entity({
    name: 'products'
})
export class Product implements IProduct {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column()
    price: number;

    @OneToOne('Stock', 'product', { cascade: true })
    stock: IStock;
}