

import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    jti: {
      type: String,
      required: true,
      unique: true,
    },
    expireAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index to auto-delete expired tokens
    },
  },
  {
    timestamps: true,
  }
);

export const  tokenModel= mongoose.model("Token", tokenSchema);
