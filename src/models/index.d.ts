import { ModelInit, MutableModel } from "@aws-amplify/datastore";

export enum Frequency {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY"
}

export enum Currency {
  INR = "INR",
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  SGD = "SGD",
  AUD = "AUD",
  CAD = "CAD"
}

type TransactionMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ChildMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Transaction {
  readonly id: string;
  readonly amount: number;
  readonly comment: string;
  readonly userID: string;
  readonly childID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Transaction, TransactionMetaData>);
  static copyOf(source: Transaction, mutator: (draft: MutableModel<Transaction, TransactionMetaData>) => MutableModel<Transaction, TransactionMetaData> | void): Transaction;
}

export declare class Child {
  readonly id: string;
  readonly name: string;
  readonly balance: number;
  readonly userID: string;
  readonly Transactions?: (Transaction | null)[] | null;
  readonly pocketMoney?: number | null;
  readonly schedule?: Frequency | keyof typeof Frequency | null;
  readonly nextMoneyAt?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Child, ChildMetaData>);
  static copyOf(source: Child, mutator: (draft: MutableModel<Child, ChildMetaData>) => MutableModel<Child, ChildMetaData> | void): Child;
}

export declare class User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly currency?: Currency | keyof typeof Currency | null;
  readonly Transactions?: (Child | null)[] | null;
  readonly Children?: (Child | null)[] | null;
  readonly onBoarded?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}