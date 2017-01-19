const WineLabelReader = require('./functions/wineLabelReader');
const Notifier = require('./functions/notifier');

module.exports = (context, myBlob) => {
  context.log("JavaScript blob trigger function processed blob \n Name:", context.bindingData.name, "\n Blob Size:", myBlob.length, "Bytes");
  const fullBlobUri = `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${context.bindingData.blobTrigger}`;

  const wineLabelReader = new WineLabelReader(context, process.env.COGNITIVE_API_KEY);
  wineLabelReader.extractTextFrom(fullBlobUri)
    .then(textFromImage => {
      const notifier = new Notifier(context, process.env.SLACK_WEBHOOK);
      return notifier.info(textFromImage);
    })
    .then(() => {
      context.done();
    })
    .catch(error => {
      context.done(error);
    });
};