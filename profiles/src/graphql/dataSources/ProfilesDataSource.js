import { DataSource } from "apollo-datasource";
import { UserInputError } from "apollo-server";

class ProfilesDataSource extends DataSource {
  constructor({ Profile }) {
    super();
    this.Profile = Profile;
  }

  _formatTags(tags) {
    return tags.map(tag => tag.replace(/\s+/g, "-").toLowerCase());
  }

  createProfile(profile) {
    if (profile.interests) {
      const formattedTags = this._formatTags(profile.interests);
      profile.interests = formattedTags;
    }

    const newProfile = new this.Profile(profile);
    return newProfile.save();
  }

  getProfile(filter) {
    return this.Profile.findOne(filter).exec();
  }

  getProfileById(id) {
    return this.Profile.findById(id);
  }

  getProfiles() {
    return this.Profile.find({}).exec();
  }
}

export default ProfilesDataSource;
