import auth0 from "../config/auth0.js";

const resolvers = {
  Account: {
    __resolveReference(reference) {
      return auth0.getUser({ id: reference.id });
    },
    id(account) {
      return account.user_id;
    },
    createdAt(account) {
      return account.created_at;
    }
  },

  Query: {
    account(root, { id }) {
      return auth0.getUser({ id });
    },
    accounts() {
      return auth0.getUsers();
    },
    viewer(root, args, { user }) {
      if (user && user.sub) {
        return auth0.getUser({ id: user.sub });
      }
      return null;
    }
  },

  Mutation: {
    createAccount(root, { data: { email, password } }) {
      return auth0.createUser({
        connection: "Username-Password-Authentication",
        email,
        password
      });
    }
  }
};

export default resolvers;
