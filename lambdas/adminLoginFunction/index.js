const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const dynamo = new AWS.DynamoDB.DocumentClient();
const JWT_SECRET = 'abc123!secure'; // 本番はSecrets Managerへ

exports.handler = async (event) => {
  try {
    console.log('イベント:', event);

    const body = JSON.parse(event.body);
    const { id, password } = body;
    console.log('受信したID:', id);
    console.log('受信したパスワード:', password);

    const result = await dynamo.get({
      TableName: 'admins',
      Key: { id }
    }).promise();
    console.log('DynamoDBからの取得結果:', result);

    const admin = result.Item;

    if (!admin) {
      console.log('管理者が存在しません');
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ error: '管理者が存在しません' })
      };
    }

    console.log('登録されているハッシュパスワード:', admin.password);

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log('パスワード一致判定:', isMatch);

    if (!isMatch) {
      return {
        statusCode: 403,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ error: 'パスワードが間違っています' })
      };
    }

    const token = jwt.sign({ id: admin.id }, JWT_SECRET, { expiresIn: '1h' });
    console.log('JWTトークン生成:', token);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ token })
    };

  } catch (err) {
    console.error('Login error:', err);
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
