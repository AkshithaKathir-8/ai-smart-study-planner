const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
{
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    subjectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subject",
        required:true
    },

    attended:{
        type:Number,
        default:0
    },

    total:{
        type:Number,
        default:0
    }

},
{
    timestamps:true
});

module.exports = mongoose.model(
    "Attendance",
    attendanceSchema
);