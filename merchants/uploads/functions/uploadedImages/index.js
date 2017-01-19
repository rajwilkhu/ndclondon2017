'use strict';
const AWS = require('aws-sdk');
const Promise = require('bluebird');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const _ = require('lodash');

class UploadedImages {
  constructor(bucket) {
    this.bucket = bucket;
  }

  getAllImages() {
    return s3.listObjects({ Bucket: this.bucket })
      .promise()
      .then(data => {
        return Promise.map(data.Contents, object => {
          const params = {
            Bucket: this.bucket,
            Key: object.Key
          };

          return s3.getObjectTagging(params)
            .promise().then(data => {
              return _.extend({}, object, data);
            });
        }).then(results => {
          console.log(`Returning ${results.length} results`);
          return results.map(result => {
            return {
              name: result.Key,
              lastModified: result.LastModified,
              size: result.Size,
              tags: result.TagSet.map(tag => { return tag.Value; }).join(', ')
            }
          })
        })
      });
  }
}

module.exports = UploadedImages;
