const mongoose = require("mongoose");


const aiMemorySchema = new mongoose.Schema({

userId:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},


key:{
type:String,
required:true
},


value:{
type:String,
required:true
}


},{
timestamps:true
});


module.exports =
mongoose.model(
"AIMemory",
aiMemorySchema
);