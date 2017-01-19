'use strict';
const azureStorage = require('azure-storage');
const Promise = require('bluebird');
const request = require('request');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const fs = require('fs')
const uuid = require('node-uuid');

const azureBlobSignatureRequestTimeout = 30000;
const azureBlobTimeout = 30000;

class AzureLabelScanner {
  constructor(blobUri, apiKey, container) {
    this.blobUri = blobUri;
    this.apiKey = apiKey;
    this.container = container;
  }

  scan(bucket, key, labels) {
    const tagValues = labels.map(label => { return label.Name; });
    const passed = tagValues.filter(value => { return value === "Bottle" }).length;

    if (passed) {
      console.log(`Found a bottle in the picture within ${bucket}/${key}; forwarding to Azure label scanner`);
      const filename = `/tmp/${uuid.v4()}-${key}.tmp`;
      this.writeObjectToFile(bucket, key, filename);

      return this.getBlobUriAndSas(key)
        .then(uriAndSas => {
          return this.writeFileToBlobStorage(uriAndSas, filename, key);
        });
    }

    console.log(`Failed to find a bottle in the picture ${bucket}/${key}; stopping here`);

    return Promise.resolve();
  }

  writeObjectToFile(bucket, key, filename) {
    s3.getObject({
      Bucket: bucket,
      Key: key
    }).createReadStream().pipe(fs.createWriteStream(filename));
  }

  writeFileToBlobStorage(uriAndSas, filename, key) {
    return new Promise((resolve, reject) => {
      const sharedBlobSvc = azureStorage.createBlobServiceWithSas(uriAndSas.host.primaryHost, uriAndSas.sas);
      sharedBlobSvc.createBlockBlobFromStream(
        this.container,
        key,
        fs.createReadStream(filename),
        fs.statSync(filename).size,
        error => {
          if (error) {
            return reject(error);
          }
          console.log(`Successfully wrote to Azure Blob storage using uri ${uriAndSas.host.primaryHost} and sas ${uriAndSas.sas}`)
          return resolve();
        });
    }).timeout(azureBlobTimeout, 'Timed out writing to Azure blob storage');
  }

  getBlobUriAndSas(key) {
    return new Promise((resolve, reject) => {
      const signedBlobRequestUri = `${this.blobUri}?code=${this.apiKey}&filename=${key}`;
      request(signedBlobRequestUri, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          console.log(`Successfully received signed blob request - ${JSON.stringify(body)}`);
          return resolve(JSON.parse(body));
        }
        return reject(error);
      })
    }).timeout(azureBlobSignatureRequestTimeout, 'Timed out querying the azure blob url request endpoint');
  }
};

module.exports = AzureLabelScanner;
