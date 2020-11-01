import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import productsList from '../database/productList.json';


export const getProductsById: APIGatewayProxyHandler = async (event, _context) => {
    const product = productsList.find(el => el.id === event.pathParameters.id);

    return {
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        statusCode: 200,
        body: JSON.stringify(product, null, 2),
    };
}
