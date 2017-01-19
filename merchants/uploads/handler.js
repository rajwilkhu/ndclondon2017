'use strict';
const signedUriGenerator = require('./functions/signedUriGenerator');
const UploadedImages = require('./functions/uploadedImages');

module.exports.create = (event, context, callback) => {
  const params = JSON.parse(event.body);
  const createdSignedUri = signedUriGenerator.generateFrom(process.env.bucket, params.name, params.type);
  callback(null, {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ uploadUri: createdSignedUri }),
  })
}

module.exports.get = (event, context, callback) => {
  const uploadedImages = new UploadedImages(process.env.bucket);
  uploadedImages.getAllImages()
    .then(images => {
      callback(null, {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(images),
      })
    })
    .catch(error => { context.fail(error); })
}
