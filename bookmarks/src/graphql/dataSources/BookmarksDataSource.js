import { DataSource } from "apollo-datasource";
import { UserInputError } from "apollo-server";

import { Pagination } from "../../../../shared/src/index.js";

class BookmarksDataSource extends DataSource {
  constructor({ Bookmark }) {
    super();
    this.Bookmark = Bookmark;
    this.pagination = new Pagination(Bookmark);
  }

  _formatTags(tags) {
    return tags.map(tag => tag.replace(/\s+/g, "-").toLowerCase());
  }

  _getBookmarkSort(sortEnum) {
    let sort = {};
    const sortArgs = sortEnum.split("_");
    const direction = sortArgs.pop();
    const field = sortArgs
      .map(arg => arg.toLowerCase())
      .map((arg, i) =>
        i === 0 ? arg : arg.charAt(0).toUpperCase() + arg.slice(1)
      )
      .join("");
    sort[field] = direction === "DESC" ? -1 : 1;

    return sort;
  }

  async createBookmark(bookmark) {
    const existingBookmarkForUrl = await this.Bookmark.findOne({
      ownerAccountId: bookmark.ownerAccountId,
      url: bookmark.url
    }).exec();

    console.log(existingBookmarkForUrl);

    if (existingBookmarkForUrl) {
      throw new UserInputError("A bookmark for the URL already exists.");
    }

    if (bookmark.tags) {
      const formattedTags = this._formatTags(bookmark.tags);
      bookmark.tags = formattedTags;
    }

    const newBookmark = new this.Bookmark(bookmark);
    return newBookmark.save();
  }

  getBookmarkById(id, userId = null) {
    return this.Bookmark.findOne({
      $or: [
        { _id: id, private: false },
        { _id: id, ownerAccountId: userId }
      ]
    }).exec();
  }

  async getUserBookmarks(
    accountId,
    { after, before, first, last, orderBy, userId = null }
  ) {
    const sort = this._getBookmarkSort(orderBy);
    const filter = {
      $or: [
        { private: false, ownerAccountId: accountId },
        {
          $and: [
            { ownerAccountId: accountId },
            { $expr: { $eq: ["$ownerAccountId", userId] } }
          ]
        }
      ]
    };
    const queryArgs = { after, before, first, last, filter, sort };
    const edges = await this.pagination.getEdges(queryArgs);
    const pageInfo = await this.pagination.getPageInfo(edges, queryArgs);

    return { edges, pageInfo };
  }

  async searchBookmarks({ after, first, searchString, userId = null }) {
    const sort = { score: { $meta: "textScore" }, _id: -1 };
    const filter = {
      $and: [
        {
          $text: { $search: searchString },
          $or: [{ private: false }, { ownerAccountId: userId }]
        }
      ]
    };
    const queryArgs = { after, first, filter, sort };
    const edges = await this.pagination.getEdges(queryArgs);
    const pageInfo = await this.pagination.getPageInfo(edges, queryArgs);

    return { edges, pageInfo };
  }
}

export default BookmarksDataSource;
