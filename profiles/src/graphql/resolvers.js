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
    __resolveReference(reference, { dataSources }, info) {
      return dataSources.profilesAPI.getProfileById(reference.id);
    },
    account(profile, args, context, info) {
      return { id: profile.accountId };
    },
    id(profile, args, context, info) {
      return profile._id;
    },
    isInNetwork(profile, args, { dataSources, user }, info) {
      return dataSources.profilesAPI.checkViewerHasInNetwork(
        user.sub,
        profile._id
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
    }
  },

  Mutation: {
    createProfile(parent, { input }, { dataSources }) {
      return dataSources.profilesAPI.createProfile(input);
    }
  }
};

export default resolvers;
