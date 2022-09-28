// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const Frequency = {
  "DAILY": "DAILY",
  "WEEKLY": "WEEKLY",
  "MONTHLY": "MONTHLY"
};

const Currency = {
  "INR": "INR",
  "USD": "USD",
  "EUR": "EUR",
  "GBP": "GBP",
  "SGD": "SGD",
  "AUD": "AUD",
  "CAD": "CAD"
};

const { Transaction, Child, User } = initSchema(schema);

export {
  Transaction,
  Child,
  User,
  Frequency,
  Currency
};