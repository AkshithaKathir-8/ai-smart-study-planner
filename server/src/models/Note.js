const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
{
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    title:{
        type:String,
        required:true
    },

    subject:{
        type:String,
        required:true
    },

    description:{
        type:String,
        default:""
    },

    pinned:{
        type:Boolean,
        default:false
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("Note",noteSchema);