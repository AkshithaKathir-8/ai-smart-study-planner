const mongoose = require("mongoose");

const chatSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    title: {
      type: String,
      default: "Conversation",
      trim: true
    }
  },
  {
    timestamps: true
  }
);

chatSessionSchema.index({
  userId: 1
});

module.exports = mongoose.model(
  "ChatSession",
  chatSessionSchema
);