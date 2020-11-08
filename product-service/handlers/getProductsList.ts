import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import productsList from '../database/productList.json';


export const getProductsList: APIGatewayProxyHandler = async () => {
    return {
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        statusCode: 200,
        body: JSON.stringify(productsList, null, 2),
    };
}
