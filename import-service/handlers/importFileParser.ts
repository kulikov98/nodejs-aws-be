import {S3Event, S3Handler} from 'aws-lambda';
import 'source-map-support/register';
import {S3, SQS} from 'aws-sdk';
import csv from 'csv-parser';

export const importFileParser: S3Handler = (event: S3Event, _context) => {
    try {
        const s3 = new S3({ region: 'us-east-1' });
        const sqs = new SQS();
        const BUCKET = 'kulikov98-nodejs-aws-uploaded';

        event.Records.forEach(record => {
            const s3Stream = s3.getObject({
                Bucket: BUCKET,
                Key: record.s3.object.key
            }).createReadStream();

            s3Stream.pipe(csv())
                .on('data', async (product) => {
                    await sqs.sendMessage({
                        QueueUrl: process.env.SQS_URL,
                        MessageBody: JSON.stringify(product)
                    }).promise();
                })
                .on('end', async () => {
                    await s3.copyObject({
                        Bucket: BUCKET,
                        CopySource: `${BUCKET}/${record.s3.object.key}`,
                        Key: record.s3.object.key.replace('uploaded', 'parsed')
                    }).promise();
                })
        });
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
}
