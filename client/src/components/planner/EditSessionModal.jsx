import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { useSubjects } from "../../context/SubjectContext";
import { usePlanner } from "../../context/PlannerContext";


function EditSessionModal({
  open,
  onClose,
  session
}) {


  const { subjects } = useSubjects();

  const { updateSession } = usePlanner();



  const [formData, setFormData] = useState({

    subjectId:"",
    topic:"",
    examDate:"",
    studyDate:"",
    startTime:"",
    endTime:"",
    difficulty:"Medium",
    priority:"Medium"

  });





  useEffect(()=>{

    if(session){

      setFormData({

        subjectId:
        session.subjectId?._id || session.subjectId || "",

        topic:
        session.topic || "",

        examDate:
        session.examDate?.split("T")[0] || "",

        studyDate:
        session.studyDate?.split("T")[0] || "",

        startTime:
        session.startTime || "",

        endTime:
        session.endTime || "",

        difficulty:
        session.difficulty || "Medium",

        priority:
        session.priority || "Medium"

      });

    }


  },[session]);






  if(!open) return null;





  const handleChange=(e)=>{

    setFormData({

      ...formData,

      [e.target.name]:e.target.value

    });

  };







  const handleUpdate=async()=>{


    await updateSession(
      session._id,
      formData
    );


    onClose();


  };







return (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">


<div className="bg-white rounded-3xl shadow-xl w-full max-w-xl p-8">


<div className="flex justify-between items-center mb-8">


<h2 className="text-2xl font-bold">

Edit Study Session

</h2>


<button onClick={onClose}>

<X size={22}/>

</button>


</div>






<div className="space-y-5">





<select

name="subjectId"

value={formData.subjectId}

onChange={handleChange}

className="w-full border rounded-2xl px-4 py-3"

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







<input

name="topic"

value={formData.topic}

onChange={handleChange}

placeholder="Topic"

className="w-full border rounded-2xl px-4 py-3"

/>







<div className="grid grid-cols-2 gap-4">


<input

type="date"

name="examDate"

value={formData.examDate}

onChange={handleChange}

className="border rounded-2xl px-4 py-3"

/>



<input

type="date"

name="studyDate"

value={formData.studyDate}

onChange={handleChange}

className="border rounded-2xl px-4 py-3"

/>


</div>







<div className="grid grid-cols-2 gap-4">


<input

type="time"

name="startTime"

value={formData.startTime}

onChange={handleChange}

className="border rounded-2xl px-4 py-3"

/>



<input

type="time"

name="endTime"

value={formData.endTime}

onChange={handleChange}

className="border rounded-2xl px-4 py-3"

/>


</div>







<select

name="difficulty"

value={formData.difficulty}

onChange={handleChange}

className="w-full border rounded-2xl px-4 py-3"

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







<select

name="priority"

value={formData.priority}

onChange={handleChange}

className="w-full border rounded-2xl px-4 py-3"

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

onClick={handleUpdate}

className="w-full bg-indigo-600 text-white rounded-2xl py-3 font-semibold"

>

Update Session

</button>





</div>


</div>


</div>

);


}


export default EditSessionModal;