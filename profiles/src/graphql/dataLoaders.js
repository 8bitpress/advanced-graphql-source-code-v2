import DataLoader from "dataloader";

import Profile from "../models/Profile.js";

function initDataLoaders() {
  const profileLoader = new DataLoader(async keys => {
    const fieldName = Object.keys(keys[0])[0];
    const fieldValues = keys.map(key => key[fieldName]);
    const uniqueFieldValues = [...new Set(fieldValues)];
    const profiles = await Profile.find({
      [fieldName]: { $in: uniqueFieldValues }
    }).exec();

    return keys.map(key =>
      profiles.find(profile => key[fieldName] === profile[fieldName].toString())
    );
  });

  return { profileLoader };
}

export default initDataLoaders;
