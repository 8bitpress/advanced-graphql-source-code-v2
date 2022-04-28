import { DataSource } from "apollo-datasource";
import { UserInputError } from "apollo-server";

import getToken from "../../utils/getToken.js";

class AccountsDataSource extends DataSource {
  constructor({ auth0 }) {
    super();
    this.auth0 = auth0;
  }

  initialize(config) {
    this.context = config.context;
  }

  // CREATE

  createAccount(email, password) {
    return this.auth0.createUser({
      connection: "Username-Password-Authentication",
      email,
      password
    });
  }

  // READ

  getAccountById(id) {
    return this.context.loaders.accountLoader.load(id);
  }

  getAccounts() {
    return this.auth0.getUsers();
  }

  // UPDATE

  updateAccountEmail(id, email) {
    return this.auth0.updateUser({ id }, { email });
  }

  async updateAccountPassword(id, newPassword, password) {
    const user = await this.auth0.getUser({ id });

    try {
      await getToken(user.email, password);
    } catch {
      throw new UserInputError("Email or existing password is incorrect.");
    }

    return this.auth0.updateUser({ id }, { password: newPassword });
  }

  // DELETE

  async deleteAccount(id) {
    try {
      await this.auth0.deleteUser({ id });
      return true;
    } catch {
      return false;
    }
  }
}

export default AccountsDataSource;
