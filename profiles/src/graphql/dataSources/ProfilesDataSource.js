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

  async checkViewerHasInNetwork(viewerAccountId, accountId) {
    const viewerProfile = await this.Profile.findOne({
      accountId: viewerAccountId
    })
      .select("network")
      .exec();

    return viewerProfile.network.includes(accountId);
  }

  getNetworkProfiles(network) {
    return this.Profile.find({ accountId: { $in: network } }).exec();
  }

  getProfile(filter) {
    return this.Profile.findOne(filter).exec();
  }

  getProfileById(id) {
    return this.Profile.findById(id).exec();
  }

  getProfiles() {
    return this.Profile.find({}).exec();
  }

  searchProfiles(searchString) {
    return this.Profile.find(
      { $text: { $search: searchString } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" }, _id: -1 })
      .exec();
  }

  async addToNetwork(accountId, accountIdToFollow) {
    return await this.Profile.findOneAndUpdate(
      { accountId },
      { $addToSet: { network: accountIdToFollow } },
      { new: true }
    );
  }

  async removeFromNetwork(accountId, accountIdToFollow) {
    return await this.Profile.findOneAndUpdate(
      { accountId },
      { $pull: { network: accountIdToFollow } },
      { new: true }
    );
  }

  async updateProfile(accountId, updatedProfileData) {
    if (
      !updatedProfileData ||
      (updatedProfileData && Object.keys(updatedProfileData).length === 0)
    ) {
      throw new UserInputError("You must supply some profile data to update.");
    }

    if (updatedProfileData.interests) {
      const formattedTags = this._formatTags(updatedProfileData.interests);
      updatedProfileData.interests = formattedTags;
    }

    return await this.Profile.findOneAndUpdate(
      { accountId },
      updatedProfileData,
      {
        new: true
      }
    );
  }

  async deleteProfile(accountId) {
    try {
      await this.Profile.findOneAndDelete({
        accountId
      }).exec();
      return true;
    } catch {
      return false;
    }
  }
}

export default ProfilesDataSource;
