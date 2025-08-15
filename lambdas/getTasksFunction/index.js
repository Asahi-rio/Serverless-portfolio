const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-northeast-1' });
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async () => {
  try {
    console.log('Lambda起動');

    const result = await dynamo.scan({
      TableName: 'tasks'
    }).promise();

    console.log('取得結果:', result);

    const items = result.Items || [];

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ items: result.Items })
    };

  } catch (error) {
    console.error('タスク取得失敗:', error);

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ message: 'タスクの取得に失敗しました。' })
    };
  }
};
