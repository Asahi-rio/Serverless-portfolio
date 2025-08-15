const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { subject } = body;

    if (!subject) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ error: 'subjectは必須です' })
      };
    }

    const params = {
      TableName: 'tasks',
      Item: { subject }
    };

    await dynamo.put(params).promise();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ message: '登録完了' })
    };
  } catch (err) {
    console.error('Error:', err);
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

