import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  accountId: {
    type: String,
    required: true
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
  network: [mongoose.Schema.Types.ObjectId],
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  }
});

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;