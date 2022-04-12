const resolvers = {
  Account: {
    __resolveReference(reference, { dataSources }) {
      return dataSources.accountsAPI.getAccountById(reference.id);
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
    createAccount(root, { data: { email, password } }, { dataSources }) {
      return dataSources.accountsAPI.createAccount(email, password);
    },
    deleteAccount(root, { id }, { dataSources }) {
      return dataSources.accountsAPI.deleteAccount(id);
    },
    updateAccountEmail(root, { data: { id, email } }, { dataSources }) {
      return dataSources.accountsAPI.updateAccountEmail(id, email);
    },
    updateAccountPassword(
      root,
      { data: { id, newPassword, password } },
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
