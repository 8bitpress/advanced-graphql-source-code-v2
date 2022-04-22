import { ApolloError } from "apollo-server";

import { DateTimeType } from "../../../shared/src/index.js";

const resolvers = {
  DateTime: DateTimeType,

  Account: {
    __resolveReference(reference, { dataSources, user }) {
      if (user?.sub) {
        return dataSources.accountsAPI.getAccountById(reference.id);
      }
      throw new ApolloError("Not authorized!");
    },
    id(account) {
      return account.user_id;
    },
    createdAt(account) {
      return account.created_at;
    }
  },

  Query: {
    account(root, { id }, { dataSources }) {
      return dataSources.accountsAPI.getAccountById(id);
    },
    accounts(root, args, { dataSources }) {
      return dataSources.accountsAPI.getAccounts();
    },
    viewer(root, args, { dataSources, user }) {
      if (user?.sub) {
        return dataSources.accountsAPI.getAccountById(user.sub);
      }
      return null;
    }
  },

  Mutation: {
    createAccount(root, { input: { email, password } }, { dataSources }) {
      return dataSources.accountsAPI.createAccount(email, password);
    },
    deleteAccount(root, { id }, { dataSources }) {
      return dataSources.accountsAPI.deleteAccount(id);
    },
    updateAccountEmail(root, { input: { id, email } }, { dataSources }) {
      return dataSources.accountsAPI.updateAccountEmail(id, email);
    },
    updateAccountPassword(
      root,
      { input: { id, newPassword, password } },
      { dataSources }
    ) {
      return dataSources.accountsAPI.updateAccountPassword(
        id,
        newPassword,
        password
      );
    }
  }
};

export default resolvers;
