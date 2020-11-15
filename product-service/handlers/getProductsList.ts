import "reflect-metadata";
import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { CONNECTION_OPTIONS } from "../database/clientConfig";
import { Connection, createConnection } from "typeorm";
import { Product } from "../models/index";
import { ProductDataMapper } from "../helpers/ProductDataMapper";


export const getProductsList: APIGatewayProxyHandler = async () => {
    let connection: Connection;

    try {
        connection = await createConnection(CONNECTION_OPTIONS);
        const productRepository = connection.getRepository(Product);
        const products = await productRepository.find({ relations: ['stock'] });

        const productsDTO = products.map(product => ProductDataMapper.toDomain(product));

        return {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            statusCode: 200,
            body: JSON.stringify(productsDTO, null, 2),
        };
    } catch(e) {
        return {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            statusCode: 500,
            body: e.message,
        }
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}
