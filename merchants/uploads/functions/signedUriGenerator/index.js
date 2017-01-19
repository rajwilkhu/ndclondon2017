'use strict';
const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

module.exports = {
  generateFrom: (bucket, filename, contentType) => {
    const parameters = {
      Bucket: bucket,
      Key:  filename,
      Expires: 60 * 60,
      ContentType: contentType
    };

    console.log(`Generating signed url for ${bucket} and ${filename}`);
    return s3.getSignedUrl('putObject', parameters);
  }
};
