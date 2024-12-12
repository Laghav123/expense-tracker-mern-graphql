import { mergeResolvers } from "@graphql-tools/merge";
import { transactionResolver } from "./transaction.resolver.js";
import { userResolver } from "./User.resolver.js";

export const mergedResolvers = mergeResolvers([userResolver, transactionResolver]);

