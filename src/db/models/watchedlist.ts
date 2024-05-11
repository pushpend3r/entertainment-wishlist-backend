import mongoose, { Schema } from "mongoose";
import { User } from "./user";

const watchedListSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: User,
  },
  media: {
    movie_ids: [Number],
    tvshow_ids: [Number],
  },
});
export const WatchedList = mongoose.model("Watchedlist", watchedListSchema);
