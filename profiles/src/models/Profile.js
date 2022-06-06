import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  accountId: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  fullName: {
    type: String,
    trim: true
  },
  interests: [String],
  network: [String],
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  }
});

profileSchema.index({ fullName: "text", username: "text" });

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
