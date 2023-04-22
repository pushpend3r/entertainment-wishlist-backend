import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  wannaWatch: {
    type: [
      {
        id: Number,
        mediaType: String,
      },
    ],
    default: [],
  },
  alreadyWatched: {
    type: [
      {
        id: Number,
        mediaType: String,
      },
    ],
    default: [],
  },
});

export default mongoose.model("user", userSchema);
