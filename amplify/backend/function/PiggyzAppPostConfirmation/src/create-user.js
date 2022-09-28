const aws = require('aws-sdk');
const docClient = new aws.DynamoDB.DocumentClient();
const tableName = process.env.API_PIGGYZAPP_USERTABLE_NAME;

exports.handler = async (event, context) => {
  const date = new Date()

  const params = {
    TableName: tableName,
    Item: {
      __typename: 'User',
      id: event.request.userAttributes.sub,
      name: event.request.userAttributes.name,
      email: event.request.userAttributes.email,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
      _version: 1,
      _lastChangedAt: date.getTime()
    },
  };

  try {
    const result = await docClient.put(params).promise();
    console.log(
      `Saved user data in DB`, JSON.stringify(result, null, 2)
    );
  } catch (err) {
    console.error(
      `Unable to save user data for ${event.request.userAttributes.sub}. Error JSON: `,
      JSON.stringify(err, null, 2)
    );
  }

  return event;
};
