const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({

userId:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},

title:{
type:String,
required:true
},

description:{
type:String
},

date:{
type:Date,
required:true
},

color:{

type:String,

enum:[
"orange",
"blue",
"emerald",
"purple"
],

default:"blue"

},

},
{
timestamps:true
});


module.exports = mongoose.model(
"Event",
eventSchema
);