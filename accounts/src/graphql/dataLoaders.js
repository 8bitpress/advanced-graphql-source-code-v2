import DataLoader from "dataloader";

import auth0 from "../config/auth0.js";

function initDataLoaders() {
  const accountLoader = new DataLoader(async keys => {
    const q = keys.map(key => `user_id:${key}`).join(" OR ");
    const accounts = await auth0.getUsers({ search_engine: "v3", q });

    return keys.map(key => accounts.find(account => account.user_id === key));
  });

  return { accountLoader };
}

export default initDataLoaders;
