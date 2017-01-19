const azureStorage = require('azure-storage');

function getDate() {
  const date = new Date();
  date.setHours((date).getHours() + 1);
  return date;
}

module.exports = (container, filename) => {
  const blobService = azureStorage.createBlobService();
  const blobUrl = blobService.generateSharedAccessSignature(container, filename, {
    AccessPolicy : {
      Permissions : 'rwdl',
      Expiry : getDate()
    }});

  return {
    filename,
    host: blobService.host,
    sas: blobUrl
  }
};