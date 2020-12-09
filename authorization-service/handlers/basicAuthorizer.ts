import {APIGatewayAuthorizerResult} from 'aws-lambda';
import 'source-map-support/register';
import {APIGatewayRequestAuthorizerHandler} from "aws-lambda/trigger/api-gateway-authorizer";

export const basicAuthorizer: APIGatewayRequestAuthorizerHandler = async (event, _context) => {
    try {
        const authHeader = event.headers['Authorization'];

        const [, encodedCreds] = authHeader.split(' ');
        const [login, password] = Buffer.from(encodedCreds, 'base64').toString().split('=');

        const storedPassword = process.env[login];
        const effect = !storedPassword || storedPassword !== password ? 'Deny' : 'Allow';

        return generatePolicy(encodedCreds, event.methodArn, effect);
    } catch (e) {
        throw new Error("Unauthorized");
    }
}

const generatePolicy = (principalId: string, resource: string, effect: string): APIGatewayAuthorizerResult => ({
    principalId: principalId,
    policyDocument: {
        Version: '2012-10-17',
        Statement: [
            {
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource
            }
        ]
    }
});
