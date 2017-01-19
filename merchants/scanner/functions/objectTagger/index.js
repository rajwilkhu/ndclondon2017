'use strict';
const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

module.exports = {
  tagObjectWithLabels: (bucket, key, labels) => {
    const tagValues = labels.map(label => { return label.Name; });

    console.log(`Decorating object with tags ${bucket}/${key}: ${tagValues}`);
    return s3.putObjectTagging({
      Bucket: bucket,
      Key: key,
      Tagging: {
        TagSet: [
          {
            Key: 'labels',
            Value: tagValues.join(':')
          }]
      }
    }).promise();
  }
};
