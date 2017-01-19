'use strict';
const AWS = require('aws-sdk');
const sns = new AWS.SNS({apiVersion: '2010-03-31'});

class LabelPublisher {
  constructor(topicArn) {
    this.topicArn = topicArn;
  }

  publish(message) {
    console.log(`Publishing message ${JSON.stringify(message)}`);
    const params = {
      Message: JSON.stringify(message),
      TopicArn: this.topicArn
    };

    return sns.publish(params).promise();
  }
}

module.exports = LabelPublisher;
