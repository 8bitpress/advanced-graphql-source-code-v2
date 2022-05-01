const resolvers = {
  Mutation: {
    deleteAllUserData(root, { accountId }, { dataSources }) {
      return dataSources.workflowsAPI.deleteAllUserData(accountId);
    }
  }
};

export default resolvers;
