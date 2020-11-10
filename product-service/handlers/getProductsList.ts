import { APIGatewayProxyHandler } from 'aws-lambda';
import { Client } from 'pg';
import 'source-map-support/register';
import { CLIENT_CONFIG } from "../database/clientConfig";


export const getProductsList: APIGatewayProxyHandler = async () => {
    const client = new Client(CLIENT_CONFIG);
    const query = 'select * from products p left join stocks s on p.id = s.product_id';

    try {
        await client.connect();
        const { rows: products } = await client.query(query);

        return {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            statusCode: 200,
            body: JSON.stringify(products, null, 2),
        };
    } catch(e) {
        return {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            statusCode: 500,
            body: 'Internal server error',
        }
    } finally {
        await client.end();
    }
}
