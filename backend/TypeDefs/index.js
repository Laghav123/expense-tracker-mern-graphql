import { mergeTypeDefs } from "@graphql-tools/merge";
import { userTypeDef } from "./User.typeDef.js";
import { transactionTypeDef } from "./transaction.typeDef.js";

export const mergedTypeDefs = mergeTypeDefs([userTypeDef, transactionTypeDef])