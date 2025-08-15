const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    console.log('event:', event);

    const body = JSON.parse(event.body);
    const { subject } = body;

    if (!subject) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ error: 'subject は必須です' })
      };
    }

    await dynamo.delete({
      TableName: 'tasks',
      Key: { subject }
    }).promise();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ message: '削除完了' })
    };

  } catch (err) {
    console.error('削除エラー:', err);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ error: 'サーバーエラー' })
    };
  }
};
