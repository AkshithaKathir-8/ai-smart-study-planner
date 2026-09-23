const mongoose = require("mongoose");


const AIChatSchema = new mongoose.Schema({

userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},


messages:[

{
sender:{
    type:String,
    enum:["user","ai"]
},

text:String,

createdAt:{
    type:Date,
    default:Date.now
}

}

]


},{
timestamps:true
});


module.exports =
mongoose.model(
"AIChat",
AIChatSchema
);