import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {IProduct} from "./types/IProduct";
import {IStock} from "./types/IStock";


@Entity({
    name: 'stocks'
})
export class Stock implements IStock {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    count: number;

    @OneToOne('Product', 'stock')
    @JoinColumn()
    product: IProduct;
}
