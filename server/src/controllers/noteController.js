const Note = require("../models/Note");

exports.getNotes = async(req,res)=>{

try{

const notes = await Note.find({
    userId:req.user.id
}).sort({
    pinned:-1,
    updatedAt:-1
});

res.json(notes);

}catch(err){

res.status(500).json({
message:err.message
});

}

};



exports.createNote = async(req,res)=>{

try{

const note = await Note.create({

userId:req.user.id,

title:req.body.title,

subject:req.body.subject,

description:req.body.description,

pinned:req.body.pinned

});

res.status(201).json(note);

}catch(err){

res.status(500).json({
message:err.message
});

}

};



exports.updateNote = async(req,res)=>{

try{

const note = await Note.findOneAndUpdate(

{
_id:req.params.id,
userId:req.user.id
},

req.body,

{
new:true
}

);

res.json(note);

}catch(err){

res.status(500).json({
message:err.message
});

}

};



exports.deleteNote = async(req,res)=>{

try{

await Note.findOneAndDelete({

_id:req.params.id,
userId:req.user.id

});

res.json({
message:"Deleted"
});

}catch(err){

res.status(500).json({
message:err.message
});

}

};



exports.togglePin = async(req,res)=>{

try{

const note = await Note.findOne({

_id:req.params.id,
userId:req.user.id

});

note.pinned=!note.pinned;

await note.save();

res.json(note);

}catch(err){

res.status(500).json({
message:err.message
});

}

};