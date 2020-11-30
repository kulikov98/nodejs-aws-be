import { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'product-service',
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: {
        forceInclude: ['pg'],
      }
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      SNS_ARN: {
        'Ref': 'SNSTopic'
      },
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "sns:*",
        Resource: {
          'Ref': 'SNSTopic'
        }
      }
    ]
  },
  resources: {
    Resources: {
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'product-service-topic'
        }
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'kulikov98@gmail.com',
          Protocol: 'email',
          TopicArn: {
            'Ref': 'SNSTopic'
          }
        }
      }
    }
  },
  functions: {
    getProductsList: {
      handler: 'handler.getProductsList',
      events: [
        {
          http: {
            method: 'get',
            path: 'products',
            cors: true,
          }
        }
      ]
    },
    getProductsById: {
      handler: 'handler.getProductsById',
      events: [
        {
          http: {
            method: 'get',
            path: 'products/{id}',
            cors: true,
            request: {
              parameters: {
                paths: {
                  id: true
                }
              }
            }
          }
        }
      ]
    },
    createProduct: {
      handler: 'handler.createProduct',
      events: [
        {
          http: {
            method: 'post',
            path: 'products/',
            cors: true
          }
        }
      ]
    },
    catalogBatchProcess: {
      handler: 'handler.catalogBatchProcess',
      events: [
        {
          sqs: {
            batchSize: 5,
            arn: { "Fn::ImportValue" : 'sqs' },
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
