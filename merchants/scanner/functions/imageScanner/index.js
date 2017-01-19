'use strict';
const AWS = require('aws-sdk');
const Promise = require('bluebird');
const rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'});

module.exports = {
  scan: (bucket, key) => {
    const params = {
      Image: {
        S3Object: {
          Bucket: bucket,
          Name: key
        }
      },
      MaxLabels: 5,
      MinConfidence: 50
    };

    return new Promise((resolve, reject) => {
      rekognition.detectLabels(params, (err, response) => {
        if (err) {
          return reject(err);
        }
        resolve(response.Labels);
      });
    });
  }
};
