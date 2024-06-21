import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    TelegramId: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    isBot: {
      type: Boolean,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    promptTokens: {
      type: Number,
      default: 0 ,
    },
    completionTokens: {
      type: Number,
      default: 0 ,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
