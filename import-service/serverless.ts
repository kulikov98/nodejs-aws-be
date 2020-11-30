import { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'import-service',
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
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
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SQS_URL: {
        'Ref': 'SQSQueue'
      }
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "s3:*",
        Resource: 'arn:aws:s3:::kulikov98-nodejs-aws-uploaded/*',
      },
      {
        Effect: "Allow",
        Action: "sqs:*",
        Resource: {
          "Fn::GetAtt": ["SQSQueue", "Arn"],
        }
      }
    ],
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'import-service-queue'
        }
      }
    },
    Outputs: {
      sqs: {
        Value: {
          "Fn::GetAtt": ["SQSQueue", "Arn"],
        },
        Export: {
          Name: 'sqs'
        }
      }
    }
  },
  functions: {
    importProductsFile: {
      handler: 'handler.importProductsFile',
      events: [
        {
          http: {
            method: 'get',
            path: 'import',
            cors: true,
            request: {
              parameters: {
                querystrings: {
                  name: true
                }
              }
            }
          }
        }
      ]
    },
    importFileParser: {
      handler: 'handler.importFileParser',
      events: [
        {
          s3: {
            bucket: 'kulikov98-nodejs-aws-uploaded',
            event: 's3:ObjectCreated:*',
            rules: [
              {
                prefix: 'uploaded/',
                suffix: 'csv'
              }
            ],
            existing: true
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
