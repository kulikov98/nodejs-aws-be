import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { S3 } from 'aws-sdk';

export const importProductsFile: APIGatewayProxyHandler = async (event, _context) => {
    try {
        const s3 = new S3({ region: 'us-east-1' });
        const params = {
            Bucket: 'kulikov98-nodejs-aws-uploaded',
            Key: `uploaded/${event.queryStringParameters.name}`,
            Expires: 60,
            ContentType: 'text/csv'
        };
        const url = await s3.getSignedUrlPromise('putObject', params) ;

        return {
            headers: { 'Access-Control-Allow-Origin': '*' },
            statusCode: 200,
            body: url,
        };
    } catch (e) {
        return {
            headers: { 'Access-Control-Allow-Origin': '*' },
            statusCode: 500,
            body: e.message
        }
    }
}
