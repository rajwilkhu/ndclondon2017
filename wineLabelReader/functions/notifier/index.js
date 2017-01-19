const Promise = require('bluebird');
const request = require('request');
const _ = require('lodash');

class Notification {
  constructor(context, uri) {
    this.context = context;
    this.uri = uri;
  }

  request(data) {
    if (!this.uri) {
      throw new Error('No Slack url configured; check the config file for this environment...');
    }

    return new Promise((resolve, reject) => {
      request.post(this.uri, {
        form: {
          payload: JSON.stringify(data)
        }
      }, (err, response) => {
        if (err) {
          return reject(err);
        }
        if (response.body !== 'ok') {
          return reject(response.body);
        }

        return resolve();
      });
    });
  }

  send(opt) {
    let options = {};
    if (_.isString(opt)) {
      options = { text: opt };
    } else {
      options = opt;
    }

    const defaults = {
      username: 'Label identified',
      text: '',
      icon_emoji: ':moneybag:'
    };

    const data = _.assign(defaults, options);

    if (options.fields) {
      if (!data.attachments) {
        data.attachments = [];
      }

      data.attachments.push({
        fallback: 'Label details',
        fields: _.map(options.fields, (value, title) => {
          return {
            title,
            value,
            short: value.length < 25
          };
        })
      });

      delete data.fields;
    }

    if (options.icon_url && !options.icon_emoji) {
      delete data.icon_emoji;
    }

    return this.request(data);
  }

  notify(defaults, opt) {
    let options = {};
    if (_.isString(opt)) {
      options = { text: opt };
    } else {
      options = opt;
    }

    return this.send(_.extend(defaults, options));
  }

  info(opt) {
    this.context.log(opt);
    return this.notify({
      channel: '#images',
      fallback: opt.text,
      icon_emoji: ':bulb:',
      username: 'images-bot',
      color: '#FF9F21',
    }, opt);
  }
}

module.exports = Notification;
