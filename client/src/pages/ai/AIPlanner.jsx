import MainLayout from "../../components/layout/MainLayout";
import { Sparkles } from "lucide-react";
import DayTimeline from "../../components/ai/DayTimeline";
import { useEffect, useState } from "react";

import {
  generateStudyPlan,
  getAIPlans
} from "../../services/aiService";

function AIPlanner(){

const [plan,setPlan] = useState(null);

const [loading,setLoading] = useState(false);


// Generate New AI Plan
const generatePlan = async()=>{

try{

setLoading(true);

const response = await generateStudyPlan({

    goal:"Semester preparation",

    days:7,

    subjects:[

      "Machine Learning",
      "Java",
      "DBMS"

    ]

});

console.log(
"GENERATED PLAN:",
response
);

setPlan(
response.plan
);

}

catch(error){

console.log(
"AI GENERATION ERROR:",
error.response?.data || error.message
);

}

finally{

setLoading(false);

}

};

// Load Previous Plan

useEffect(()=>{


const loadPlan = async()=>{


try{


const response =
await getAIPlans();



console.log(
"SAVED PLANS:",
response
);

if(
Array.isArray(response) &&
response.length > 0
){

if(response?.plan){
   setPlan(response.plan);
}

}



}

catch(error){


console.log(
"LOAD PLAN ERROR:",
error.response?.data || error.message
);



}


};



loadPlan();



},[]);






return(

<MainLayout>


<div className="space-y-8">





<div
className="
rounded-3xl
p-8
text-white
bg-gradient-to-r
from-indigo-600
via-purple-600
to-pink-600
shadow-xl
"
>


<div className="flex items-center gap-4">


<div
className="
bg-white/20
p-4
rounded-2xl
"
>


<Sparkles size={32}/>


</div>



<div>


<h1
className="
text-4xl
font-bold
"
>

AI Study Planner

</h1>



<p
className="
text-indigo-100
mt-2
"
>

Personalized learning roadmap powered by AI

</p>



</div>



</div>




<button

onClick={generatePlan}

className="
mt-6
bg-white
text-indigo-700
px-7
py-3
rounded-xl
font-semibold
hover:scale-105
transition
"

>


{

loading

?

"Generating..."

:

"Generate New Plan ✨"

}



</button>




</div>







{

plan?.sessions &&

<div className="space-y-10">


{

[

...new Set(

plan.sessions.map(

(session)=>session.day

)

)

]


.map((day)=>(


<DayTimeline

key={day}

day={day}

sessions={plan.sessions}

/>



))


}



</div>


}






{

!plan && !loading &&

<div
className="
bg-white
rounded-3xl
p-8
shadow-lg
text-center
"
>

<h2 className="
text-xl
font-semibold
text-slate-700
">

No AI plan generated yet

</h2>


<p className="
text-slate-500
mt-2
">

Click Generate New Plan to create your personalized roadmap.

</p>


</div>


}




</div>



</MainLayout>


);


}


export default AIPlanner;