import { useState } from "react";
import { X } from "lucide-react";

import { useSubjects } from "../../context/SubjectContext";
import { usePlanner } from "../../context/PlannerContext";


function AddSessionModal({
  open,
  onClose
}) {


  const { subjects } = useSubjects();

  const { addSession } = usePlanner();



  const initialState = {

    subjectId: "",
    topic: "",
    examDate: "",
    studyDate: "",
    startTime: "",
    endTime: "",
    difficulty: "Medium",
    priority: "Medium",
    aiRecommendation: ""

  };


  const [formData, setFormData] = useState(initialState);




  if (!open) return null;




  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });

  };





  const generateRecommendation = () => {


    let recommendation = "";


    if(formData.difficulty === "Hard"){

      recommendation =
      "Break the topic into smaller concepts and practice regularly.";

    }

    else if(formData.difficulty === "Medium"){

      recommendation =
      "Revise important concepts and solve practice questions.";

    }

    else{

      recommendation =
      "Focus on fundamentals and build strong understanding.";

    }



    if(formData.priority === "High"){

      recommendation +=
      " Allocate extra time before the deadline.";

    }



    setFormData({

      ...formData,

      aiRecommendation: recommendation

    });


  };






  const handleSubmit = async () => {


    if(
      !formData.subjectId ||
      !formData.topic ||
      !formData.studyDate
    ){

      alert(
        "Please fill Subject, Topic and Study Date"
      );

      return;

    }



    await addSession(formData);



    setFormData(initialState);


    onClose();


  };







return (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">


<div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-8 max-h-[90vh] overflow-y-auto">


<div className="flex justify-between items-center mb-8">


<h2 className="text-2xl font-bold text-slate-800">

Add Study Session

</h2>



<button

onClick={onClose}

className="p-2 rounded-xl hover:bg-slate-100"

>

<X size={22}/>

</button>


</div>





<div className="space-y-5">





{/* Subject */}

<select

name="subjectId"

value={formData.subjectId}

onChange={handleChange}

className="w-full rounded-2xl border border-slate-300 px-4 py-3"

>


<option value="">

Select Subject

</option>


{
subjects.map((subject)=>(


<option

key={subject._id}

value={subject._id}

>

{subject.name || subject.subject}

</option>


))
}


</select>







{/* Topic */}

<input

name="topic"

value={formData.topic}

onChange={handleChange}

placeholder="Topic Name"

className="w-full rounded-2xl border border-slate-300 px-4 py-3"

/>







{/* Dates */}

<div className="grid grid-cols-2 gap-4">


<div>


<label className="block mb-2 text-sm font-medium text-slate-700">

Exam Date

</label>


<input

type="date"

name="examDate"

value={formData.examDate}

onChange={handleChange}

className="w-full rounded-2xl border border-slate-300 px-4 py-3"

/>


</div>





<div>


<label className="block mb-2 text-sm font-medium text-slate-700">

Study Date

</label>


<input

type="date"

name="studyDate"

value={formData.studyDate}

onChange={handleChange}

className="w-full rounded-2xl border border-slate-300 px-4 py-3"

/>


</div>



</div>









{/* Time */}

<div className="grid grid-cols-2 gap-4">


<div>

<label className="block mb-2 text-sm font-medium text-slate-700">

Start Time

</label>


<input

type="time"

name="startTime"

value={formData.startTime}

onChange={handleChange}

className="w-full rounded-2xl border border-slate-300 px-4 py-3"

/>


</div>




<div>

<label className="block mb-2 text-sm font-medium text-slate-700">

End Time

</label>


<input

type="time"

name="endTime"

value={formData.endTime}

onChange={handleChange}

className="w-full rounded-2xl border border-slate-300 px-4 py-3"

/>


</div>


</div>









{/* Difficulty */}

<select

name="difficulty"

value={formData.difficulty}

onChange={handleChange}

className="w-full rounded-2xl border border-slate-300 px-4 py-3"

>


<option value="Easy">
Easy
</option>


<option value="Medium">
Medium
</option>


<option value="Hard">
Hard
</option>


</select>









{/* Priority */}

<select

name="priority"

value={formData.priority}

onChange={handleChange}

className="w-full rounded-2xl border border-slate-300 px-4 py-3"

>


<option value="Low">
Low
</option>


<option value="Medium">
Medium
</option>


<option value="High">
High
</option>


</select>









<button

onClick={generateRecommendation}

className="w-full bg-purple-600 text-white rounded-2xl py-3 font-semibold hover:bg-purple-700"

>

Generate AI Recommendation 🤖

</button>








{
formData.aiRecommendation && (

<div className="bg-indigo-50 rounded-2xl p-4">

<p className="text-indigo-700">

🤖 {formData.aiRecommendation}

</p>

</div>

)

}









<button

onClick={handleSubmit}

className="w-full bg-indigo-600 text-white rounded-2xl py-3 font-semibold hover:bg-indigo-700"

>

Save Study Session

</button>






</div>


</div>


</div>

);


}


export default AddSessionModal;