import "reflect-metadata";
import 'source-map-support/register';
import {APIGatewayProxyHandler} from 'aws-lambda';
import {CONNECTION_OPTIONS} from "../database/clientConfig";
import {Connection, createConnection} from "typeorm";
import {Product} from "../models/Product";


export const createProduct: APIGatewayProxyHandler = async (event) => {
    let connection: Connection;

    try {
        const {title, description, price, count} = JSON.parse(event.body);

        // dumb validation
        if (!title || !description || !price || !count) {
            return {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                statusCode: 400,
                body: 'Invalid arguments',
            }
        }

        connection = await createConnection(CONNECTION_OPTIONS);
        const productRepository = connection.getRepository(Product);
        const newProduct = productRepository.create({ title, description, price, stock: { count } });
        await productRepository.save(newProduct);

        return {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            statusCode: 201,
            body: null,
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
