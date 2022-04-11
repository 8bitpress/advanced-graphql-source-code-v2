import { UserInputError } from "apollo-server";

import auth0 from "../config/auth0.js";
import getToken from "../utils/getToken.js";

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
    },
    async deleteAccount(root, { id }) {
      try {
        await auth0.deleteUser({ id });
        return true;
      } catch {
        return false;
      }
    },
    updateAccountEmail(root, { data: { id, email } }) {
      return auth0.updateUser({ id }, { email });
    },
    async updateAccountPassword(root, { data: { id, newPassword, password } }) {
      const user = await auth0.getUser({ id });

      try {
        await getToken(user.email, password);
      } catch {
        throw new UserInputError("Email or existing password is incorrect.");
      }

      return auth0.updateUser({ id }, { password: newPassword });
    }
  }
};

export default resolvers;
