const mongoose = require("mongoose");


const AIPlanSchema = new mongoose.Schema(

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


    goal:{
        type:String,
        required:true
    },


    subjects:{
        type:[String],
        default:[]
    },


    days:{
        type:Number,
        default:7
    },


    plan:{
        type:String,
        required:true
    }

},

{
    timestamps:true
}

);


module.exports = mongoose.model(
    "AIPlan",
    AIPlanSchema
);