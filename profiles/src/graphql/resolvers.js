import { UserInputError } from "apollo-server";

import { DateTimeType } from "../../../shared/src/index.js";

const resolvers = {
  DateTime: DateTimeType,

  Account: {
    profile(account, args, { dataSources }) {
      return dataSources.profilesAPI.getProfile({
        accountId: account.id
      });
    }
  },

  Profile: {
    __resolveReference(reference, { dataSources }) {
      return dataSources.profilesAPI.getProfileById(reference.id);
    },
    account(profile) {
      return { id: profile.accountId };
    },
    network(profile, args, { dataSources }) {
      return dataSources.profilesAPI.getNetworkProfiles({
        ...args,
        network: profile.network
      });
    },
    id(profile) {
      return profile._id;
    },
    isInNetwork(profile, args, { dataSources, user }) {
      return dataSources.profilesAPI.checkViewerHasInNetwork(
        user.sub,
        profile.accountId
      );
    }
  },

  Query: {
    async profile(root, { username }, { dataSources }) {
      const profile = await dataSources.profilesAPI.getProfile({ username });

      if (!profile) {
        throw new UserInputError("Profile does not exist.");
      }
      return profile;
    },
    profiles(root, args, { dataSources }) {
      return dataSources.profilesAPI.getProfiles();
    },
    searchProfiles(root, { query }, { dataSources }) {
      return dataSources.profilesAPI.searchProfiles(query);
    }
  },

  Mutation: {
    addToNetwork(
      root,
      { input: { accountId, networkMemberId } },
      { dataSources }
    ) {
      return dataSources.profilesAPI.addToNetwork(accountId, networkMemberId);
    },
    createProfile(root, { input }, { dataSources }) {
      return dataSources.profilesAPI.createProfile(input);
    },
    removeFromNetwork(
      root,
      { input: { accountId, networkMemberId } },
      { dataSources }
    ) {
      return dataSources.profilesAPI.removeFromNetwork(
        accountId,
        networkMemberId
      );
    },
    deleteProfile(root, { accountId }, { dataSources }) {
      return dataSources.profilesAPI.deleteProfile(accountId);
    },
    updateProfile(root, { input: { accountId, ...rest } }, { dataSources }) {
      return dataSources.profilesAPI.updateProfile(accountId, rest);
    }
  }
};

export default resolvers;
