import {EntityDataMapper} from './EntityDataMapper';
import {DomainProduct} from "../types/DomainProduct";
import {Product} from "../models/Product";


export class ProductDataMapper extends EntityDataMapper {
    static toDomain(product: Product): DomainProduct {

        return Object.keys(product).reduce((acc, key) => {
            switch (key) {
                case 'stock': {
                    return {...acc, count: product.stock.count}
                }
                default: {
                    return {...acc, [key]: product[key]};
                }
            }
        }, {} as DomainProduct);
    }
}