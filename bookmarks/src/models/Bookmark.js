import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  ownerAccountId: {
    type: String,
    required: true
  },
  private: {
    type: Boolean,
    default: false,
    required: true
  },
  notes: {
    type: String
  },
  tags: [
    {
      type: String
    }
  ],
  title: {
    type: String
  },
  url: {
    type: String,
    required: true
  }
});

bookmarkSchema.index({ title: "text", notes: "text" });

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;
