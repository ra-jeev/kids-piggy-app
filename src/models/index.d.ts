import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection } from "@aws-amplify/datastore";

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

type EagerTransaction = {
  readonly id: string;
  readonly amount: number;
  readonly comment: string;
  readonly userID: string;
  readonly childID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyTransaction = {
  readonly id: string;
  readonly amount: number;
  readonly comment: string;
  readonly userID: string;
  readonly childID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Transaction = LazyLoading extends LazyLoadingDisabled ? EagerTransaction : LazyTransaction

export declare const Transaction: (new (init: ModelInit<Transaction, TransactionMetaData>) => Transaction) & {
  copyOf(source: Transaction, mutator: (draft: MutableModel<Transaction, TransactionMetaData>) => MutableModel<Transaction, TransactionMetaData> | void): Transaction;
}

type EagerChild = {
  readonly id: string;
  readonly name: string;
  readonly balance: number;
  readonly userID: string;
  readonly Transactions?: (Transaction | null)[] | null;
  readonly pocketMoney?: number | null;
  readonly schedule?: Frequency | keyof typeof Frequency | null;
  readonly nextMoneyAt?: number | null;
  readonly photoUrlKey?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyChild = {
  readonly id: string;
  readonly name: string;
  readonly balance: number;
  readonly userID: string;
  readonly Transactions: AsyncCollection<Transaction>;
  readonly pocketMoney?: number | null;
  readonly schedule?: Frequency | keyof typeof Frequency | null;
  readonly nextMoneyAt?: number | null;
  readonly photoUrlKey?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Child = LazyLoading extends LazyLoadingDisabled ? EagerChild : LazyChild

export declare const Child: (new (init: ModelInit<Child, ChildMetaData>) => Child) & {
  copyOf(source: Child, mutator: (draft: MutableModel<Child, ChildMetaData>) => MutableModel<Child, ChildMetaData> | void): Child;
}

type EagerUser = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly currency?: Currency | keyof typeof Currency | null;
  readonly Transactions?: (Child | null)[] | null;
  readonly Children?: (Child | null)[] | null;
  readonly onBoarded?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly currency?: Currency | keyof typeof Currency | null;
  readonly Transactions: AsyncCollection<Child>;
  readonly Children: AsyncCollection<Child>;
  readonly onBoarded?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User, UserMetaData>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}