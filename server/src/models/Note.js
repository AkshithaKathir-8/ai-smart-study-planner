const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    pinned: {
      type: Boolean,
      default: false,
    },

    // Uploaded study material
    fileName: {
      type: String,
      default: "",
    },

    filePath: {
      type: String,
      default: "",
    },

    fileType: {
      type: String,
      default: "",
    },
     
    aiSummary: {
  type: String,
  default: "",
},

twoMarkQuestions: {
  type: [
    {
      question: {
        type: String,
        default: "",
      },
      answer: {
        type: String,
        default: "",
      },
    },
  ],
  default: [],
},
    // Text extracted from the uploaded file.
    // This is what Kortex will use for summarizing,
    // generating questions, flashcards, etc.
    extractedText: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("Note", noteSchema);