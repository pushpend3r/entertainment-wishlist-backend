import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
  },
  {
    virtuals: {
      wishlist: {
        options: {
          ref: "Wishlist",
          localField: "_id",
          foreignField: "user",
          justOne: true,
        },
      },
      watchedlist: {
        options: {
          ref: "Watchedlist",
          localField: "_id",
          foreignField: "user",
          justOne: true,
        },
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    next();
  }
  const saltRounds = 10;
  const password = user.password;
  const hashPassword = await bcrypt.hash(password, saltRounds);
  user.password = hashPassword;
});

userSchema.methods.comparePassword = async function (enteredPassword: string) {
  const isMatched = await bcrypt.compare(enteredPassword, this.password);
  return isMatched;
};

export const User = mongoose.models.User || mongoose.model("User", userSchema);
