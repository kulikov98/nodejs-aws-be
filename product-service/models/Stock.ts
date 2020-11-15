import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import { Product } from "./index";

@Entity({
    name: 'stocks'
})
export class Stock {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    count: number;

    @OneToOne('Product', 'stock')
    @JoinColumn()
    product: Product;
}
