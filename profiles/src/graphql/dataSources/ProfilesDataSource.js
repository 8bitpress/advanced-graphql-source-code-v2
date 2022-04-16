import { DataSource } from "apollo-datasource";
import { UserInputError } from "apollo-server";

class ProfilesDataSource extends DataSource {
  constructor({ Profile }) {
    super();
    this.Profile = Profile;
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
