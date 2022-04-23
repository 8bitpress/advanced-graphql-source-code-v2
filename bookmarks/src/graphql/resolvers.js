import { UserInputError } from "apollo-server";

import { DateTimeType, URLType } from "../../../shared/src/index.js";

const resolvers = {
  DateTime: DateTimeType,
  URL: URLType,

  Bookmark: {
    id(bookmark) {
      return bookmark._id;
    },
    owner(bookmark) {
      return { account: { id: bookmark.ownerAccountId } };
    }
  },

  Profile: {
    bookmarks(profile, args, { dataSources, user }) {
      return dataSources.bookmarksAPI.getUserBookmarks(profile.account.id, {
        ...args,
        userId: user?.sub ? user.sub : null
      });
    }
  },

  Query: {
    async bookmark(root, { id }, { dataSources, user }) {
      const userId = user?.sub ? user.sub : null;
      const bookmark = await dataSources.bookmarksAPI.getBookmarkById(
        id,
        userId
      );

      if (!bookmark) {
        throw new UserInputError("Bookmark not available.");
      }

      return bookmark;
    },
    searchBookmarks(root, { after, first, query }, { dataSources, user }) {
      return dataSources.bookmarksAPI.searchBookmarks({
        after,
        first,
        searchString: query,
        userId: user?.sub ? user.sub : null
      });
    }
  },

  Mutation: {
    createBookmark(root, { input }, { dataSources }) {
      return dataSources.bookmarksAPI.createBookmark(input);
    }
  }
};

export default resolvers;
