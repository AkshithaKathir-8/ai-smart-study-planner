const mongoose = require("mongoose");


const plannerSchema = new mongoose.Schema(

{

    userId: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true

    },


    subjectId: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Subject",

        required: true

    },


    topic: {

        type: String,

        required: true

    },


    examDate: {

        type: Date,

        required: true

    },


    studyDate: {

        type: Date,

        required: true

    },


    startTime: {

        type: String,

        required: true

    },


    endTime: {

        type: String,

        required: true

    },


    difficulty: {

        type: String,

        enum: [
            "Easy",
            "Medium",
            "Hard"
        ],

        default:"Medium"

    },


    priority: {

        type: String,

        enum:[
            "Low",
            "Medium",
            "High"
        ],

        default:"Medium"

    },


    status: {

        type:String,

        enum:[
            "Pending",
            "Completed"
        ],

        default:"Pending"

    },


    aiRecommendation: {

        type:String,

        default:""

    }



},


{
    timestamps:true
}


);



module.exports =
mongoose.model(
    "Planner",
    plannerSchema
);