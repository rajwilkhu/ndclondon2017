const https = require('https');
const Promise = require('bluebird');
const _ = require('lodash');

class WineLabelReader {
  constructor(context, cognitiveApiKey) {
    this.context = context;
    this.options = {
      host: 'api.projectoxford.ai',
      path: '/vision/v1.0/ocr',
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
        'Ocp-Apim-Subscription-Key': cognitiveApiKey
      }
    };
  }

  extractWordsFrom(words) {
    if (!words) { return []; }
    return words.map(word => { return word.text; });
  }

  extractLinesFrom(lines) {
    if (!lines) { return []; }
    return lines.map(line => { return this.extractWordsFrom(line.words); });
  }

  extractLabelsFrom(regions) {
    if (!regions) { return []; }
    return regions.map(region => { return this.extractLinesFrom(region.lines); });
  }

  extractMeta(uri, response) {
    this.context.log(JSON.stringify(response));

    const notificationMessage = `Optical Character Recognition: discovered the following text from ${uri}`;
    return {
      text: notificationMessage,
      fields: {
          'Language': response.language,
          'Angle': response.textAngle,
          'Orientation': response.orientation,
          'Label Text': JSON.stringify(_.flattenDeep(this.extractLabelsFrom(response.regions)))
      }
    }
  }

  extractTextFrom(uri) {
    return new Promise((resolve, reject) => {
      const httpRequest = https.request(this.options, response => {
        let text = '';
        response.on('data', chunk => { text += chunk; });
        response.on('end', () => { resolve(this.extractMeta(uri, JSON.parse(text))); });
        response.on('error', error => { reject(error); });
      });
      httpRequest.write(`{"url":"${uri}"}`);
      httpRequest.end();
    });
  }
}

module.exports = WineLabelReader;
