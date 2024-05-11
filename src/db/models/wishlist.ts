import mongoose, { Schema } from "mongoose";
import { User } from "./user";

const wishlistSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: User,
  },
  media: {
    movie_ids: [Number],
    tvshow_ids: [Number],
  },
});

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);
