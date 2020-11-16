import "reflect-metadata";
import 'source-map-support/register';
import {APIGatewayProxyHandler} from 'aws-lambda';
import {CONNECTION_OPTIONS} from "../database/clientConfig";
import {Connection, createConnection} from "typeorm";
import {Product} from "../models/Product";
import {ProductDataMapper} from "../helpers/ProductDataMapper";


export const getProductsById: APIGatewayProxyHandler = async (event, _context) => {
    let connection: Connection;

    try {
        connection = await createConnection(CONNECTION_OPTIONS);
        const productRepository = connection.getRepository(Product);
        const product = await productRepository.findOne({relations: ['stock'], where: {id: event.pathParameters.id}});
        const productDTO = ProductDataMapper.toDomain(product);

        return {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            statusCode: 200,
            body: JSON.stringify(productDTO, null, 2),
        };
    } catch (e) {
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
