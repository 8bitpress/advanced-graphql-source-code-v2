import { DataSource } from "apollo-datasource";
import { UserInputError } from "apollo-server";

import { Pagination } from "../../../../shared/src/index.js";

class BookmarksDataSource extends DataSource {
  constructor({ Bookmark }) {
    super();
    this.Bookmark = Bookmark;
    this.pagination = new Pagination(Bookmark);
  }
}

export default BookmarksDataSource;
