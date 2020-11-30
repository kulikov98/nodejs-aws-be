import "reflect-metadata";
import 'source-map-support/register';
import {SQSEvent, SQSHandler} from 'aws-lambda';
import {CONNECTION_OPTIONS} from "../database/clientConfig";
import {Connection, createConnection} from "typeorm";
import {Product} from "../models/Product";
import {SNS} from "aws-sdk";


export const catalogBatchProcess: SQSHandler = async (event: SQSEvent) => {
    let connection: Connection;

    try {
        const sns = new SNS({region: 'us-east-1'});
        const products = event.Records.map(({body}) => JSON.parse(body));
        connection = await createConnection(CONNECTION_OPTIONS);
        const productRepository = connection.getRepository(Product);

        const promises = products.map(product => {
            const {title, description, price, count} = product;
            const newProduct = productRepository.create({title, description, price, stock: {count}});
            return productRepository.save(newProduct);
        });

        await Promise.all(promises);

        await sns.publish({
            Subject: 'Products have been added',
            Message: 'The following products have been successfully added: ' + products.map(p => p.title).join(', '),
            TopicArn: process.env.SNS_ARN
        }).promise();
    } catch (e) {
        console.log('Error:', e);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}
