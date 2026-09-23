const mongoose = require("mongoose");


const subjectSchema = new mongoose.Schema(

  {

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


    name: {
      type: String,
      required: true,
      trim: true,
    },


    code: {
      type: String,
      trim: true,
    },


    credits: {
      type: Number,
      default: 0,
    },


    color: {
      type: String,
      default: "blue",
    },


  },

  {
    timestamps: true,
  }

);



const Subject = mongoose.model(
  "Subject",
  subjectSchema
);



module.exports = Subject;