const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');

const webServerPort = process.env.PORT || 8080;

const server = new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true
});

server.listen(webServerPort, err => {
    if (err) {
      console.log(err);
      return;
    }

    console.log(`Started webpack server listening on port ${webServerPort}`);
});
