'use strict';
const Promise = require('bluebird');
const imageScanner = require('./functions/imageScanner');
const objectTagger = require('./functions/objectTagger');
const LabelScanner = require('./functions/labelScanner');
const LabelPublisher = require('./functions/labelPublisher');

module.exports.scanImage = (event, context) => {
  console.log(`Received event: ${JSON.stringify(event)}`);
  const labelPublisher = new LabelPublisher(process.env.topic);

  Promise.map(event.Records, record => {
    const bucket = record.s3.bucket.name;
    const key = record.s3.object.key;
    console.log(`Received object updated event for bucket ${bucket} and key ${key}`);

    return imageScanner.scan(bucket, key)
      .then(labels => {
        return labelPublisher.publish({ bucket, key, labels })
      });
  })
  .then(() => { context.succeed(); })
  .catch(error => { context.fail(error); })
};

module.exports.tag = (event, context) => {
  console.log(`Received event: ${JSON.stringify(event)}`);

  Promise.map(event.Records, record => {
    const message = JSON.parse(record.Sns.Message);
    objectTagger.tagObjectWithLabels(message.bucket, message.key, message.labels)
      .then(() => { context.succeed(); })
      .catch(error => { context.fail(error); });
  })

};

module.exports.scanLabel = (event, context) => {
  console.log(`Received event: ${JSON.stringify(event)}`);

  const labelScanner = new LabelScanner(process.env.labelScannerUri, process.env.labelScannerApiKey, process.env.labelScannerContainer);
  Promise.map(event.Records, record => {
    const message = JSON.parse(record.Sns.Message);
    labelScanner.scan(message.bucket, message.key, message.labels)
      .then(() => { context.succeed(); })
      .catch(error => { context.fail(error); })
  });
};
