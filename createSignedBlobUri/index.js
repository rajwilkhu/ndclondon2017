const signedBlobUriCreator = require('./functions/signedBlobUriCreator');

module.exports = (context, req) => {
  let res;
  if (req.query.filename) {
    res = {
      status: 200,
      body: signedBlobUriCreator('wines', req.query.filename)
    };
  }
  else {
    res = {
      status: 400,
      body: JSON.stringify({ error: "Please pass the filename on the query string or in the request body" })
    };
  }
  context.done(null, res);
};
