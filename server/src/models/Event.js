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

time: {
  type: String,
  default: ""
},

type: {
  type: String,
  enum: ["study", "assignment", "exam", "personal"],
  default: "study"
},

time:{

type:String,

default:""

},

type:{

type:String,

enum:[
  "study",
  "assignment",
  "exam",
  "personal"
],

default:"study"

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