/* Amplify Params - DO NOT EDIT
	API_PIGGYZAPP_GRAPHQLAPIENDPOINTOUTPUT
	API_PIGGYZAPP_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const https = require('https');
const AWS = require('aws-sdk');
const { randomUUID } = require('crypto');
const urlParse = require('url').URL;

const GRAPHQL_ENDPOINT = process.env.API_PIGGYZAPP_GRAPHQLAPIENDPOINTOUTPUT;

const REGION = process.env.REGION;
const endpoint = new urlParse(GRAPHQL_ENDPOINT).hostname.toString();

const getSignedRequest = (body) => {
  const req = new AWS.HttpRequest(GRAPHQL_ENDPOINT, REGION);
  req.method = 'POST';
  req.path = '/graphql';
  req.headers.host = endpoint;
  req.headers['Content-Type'] = 'application/json';
  req.body = body;

  console.log('request body is: ', body);

  const signer = new AWS.Signers.V4(req, 'appsync', true);
  signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());

  return req;
};

const executeReq = (req) => {
  return new Promise((resolve, reject) => {
    const httpRequest = https.request({ ...req, host: endpoint }, (result) => {
      let data = '';

      result.on('data', (chunk) => {
        data += chunk;
      });

      result.on('end', () => {
        resolve(JSON.parse(data.toString()));
      });
    });

    httpRequest.write(req.body);
    httpRequest.end();
  });
};

const getEligibleChildren = async (timestamp) => {
  const variables = {
    filter: {
      nextMoneyAt: { ge: timestamp - 120, le: timestamp + 120 },
    },
  };

  const body = JSON.stringify({
    query: `
      query List_Children(
          $filter: ModelChildFilterInput
          $limit: Int
          $nextToken: String
        ) {
          listChildren(filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
              id
              name
              balance
              nextMoneyAt
              pocketMoney
              schedule
              userID
              _version
            }
            nextToken
          }
        }
        `,
    operationName: 'List_Children',
    variables,
  });

  const req = getSignedRequest(body);
  const res = await executeReq(req);

  console.log('eligible children for payout: %j', res);
  return res.data.listChildren.items;
};

const depositPocketMoney = (child, timestamp, eventDate) => {
  const transactionVariables = {
    input: {
      id: randomUUID(),
      amount: child.pocketMoney,
      comment: '👏 Pocket money added',
      childID: child.id,
      userID: child.userID,
    },
  };

  const transactionBody = JSON.stringify({
    query: `
      mutation Create_Transaction($input: CreateTransactionInput!) {
          createTransaction(input: $input) {
            id
            amount
            comment
            userID
            childID
            createdAt
            updatedAt
            _version
            _lastChangedAt
            _deleted
          }
        }
    `,
    operationName: 'Create_Transaction',
    variables: transactionVariables,
  });

  const createTransactionReq = getSignedRequest(transactionBody);

  //   console.log('transaction create response: %j', transactionRes);

  const childVariables = {
    input: {
      id: child.id,
      balance: child.balance + child.pocketMoney,
      _version: child._version,
    },
  };

  if (child.schedule === 'DAILY') {
    childVariables.input.nextMoneyAt = timestamp + 86400;
  } else if (child.schedule === 'WEEKLY') {
    childVariables.input.nextMoneyAt = timestamp + 7 * 86400;
  } else if (child.schedule === 'MONTHLY') {
    const nextMoneyDate = new Date();
    nextMoneyDate.setUTCHours(0, 0, 0);
    nextMoneyDate.setUTCMonth(eventDate.getMonth() + 1, 1);
    childVariables.input.nextMoneyAt = parseInt(nextMoneyDate.getTime() / 1000);
  } else {
    console.error(`Unsupported child payout schedule: ${child.schedule}`);
  }

  const childUpdateBody = JSON.stringify({
    query: `
      mutation Update_Child($input: UpdateChildInput!, $condition: ModelChildConditionInput) {
        updateChild(input: $input, condition: $condition) {
          id
          name
          balance
          userID
          pocketMoney
          schedule
          nextMoneyAt
          createdAt
          updatedAt
          _version
          _lastChangedAt
          _deleted
        }
      }
    `,
    operationName: 'Update_Child',
    variables: childVariables,
    condition: null,
  });
  const childUpdateReq = getSignedRequest(childUpdateBody);

  //   console.log('child update response: %j', childUpdateRes);
  return [executeReq(createTransactionReq), executeReq(childUpdateReq)];
};

exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const eventDate = new Date(event.time);
  const timestamp = eventDate.getTime() / 1000;

  const children = await getEligibleChildren(timestamp);

  const promises = [];
  for (const child of children) {
    promises.push(...depositPocketMoney(child, timestamp, eventDate));
  }

  const res = await Promise.allSettled(promises);
  console.log('final result of the handler: %j', res);
};
