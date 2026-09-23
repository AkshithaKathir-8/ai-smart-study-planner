const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatSession",
      required: true
    },

    role: {
      type: String,
      enum: ["user", "ai"],
      required: true
    },

    message: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

chatSchema.index({
  userId: 1,
  conversationId: 1,
  createdAt: 1
});

module.exports = mongoose.model("Chat", chatSchema);