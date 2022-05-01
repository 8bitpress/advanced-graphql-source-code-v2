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
      const userId = user?.sub ? user.sub : null;

      return dataSources.bookmarksAPI.getUserBookmarks(
        profile.account.id,
        userId,
        args
      );
    },
    recommendedBookmarks({ account, interests }, args, { dataSources }) {
      return dataSources.bookmarksAPI.getRecommendedBookmarks(
        account.id,
        interests,
        args
      );
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
      const userId = user?.sub ? user.sub : null;

      return dataSources.bookmarksAPI.searchBookmarks(userId, {
        after,
        first,
        searchString: query
      });
    }
  },

  Mutation: {
    createBookmark(root, { input }, { dataSources }) {
      return dataSources.bookmarksAPI.createBookmark(input);
    },
    deleteAllUserBookmarks(root, { ownerAccountId }, { dataSources }) {
      return dataSources.bookmarksAPI.deleteAllUserBookmarks(ownerAccountId);
    },
    deleteBookmark(root, { input: { id } }, { dataSources, user }) {
      const userId = user?.sub ? user.sub : null;

      return dataSources.bookmarksAPI.deleteBookmark(id, userId);
    },
    async updateBookmark(
      root,
      { input: { id, ...rest } },
      { dataSources, user }
    ) {
      const userId = user?.sub ? user.sub : null;
      const bookmark = await dataSources.bookmarksAPI.updateBookmark(
        id,
        userId,
        rest
      );

      if (!bookmark) {
        throw new UserInputError("Bookmark cannot be updated.");
      }

      return bookmark;
    }
  }
};

export default resolvers;
