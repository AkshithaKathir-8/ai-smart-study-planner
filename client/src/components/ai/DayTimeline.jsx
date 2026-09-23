import { Clock, Sparkles } from "lucide-react";


function DayTimeline({
    day,
    sessions
}){


const daySessions =
sessions.filter(
(session)=>session.day === day
);



return (

<div className="
bg-white
rounded-3xl
shadow-lg
border
border-slate-200
p-6
">


<div className="
flex
items-center
gap-3
mb-6
">

<div className="
bg-indigo-100
p-3
rounded-xl
">

<Sparkles
className="text-indigo-600"
/>

</div>


<h2 className="
text-2xl
font-bold
text-slate-800
">

Day {day}

</h2>


</div>



<div className="space-y-4">


{
daySessions.map((session)=>(


<div

key={session._id}

className="
rounded-2xl
bg-gradient-to-r
from-indigo-50
to-purple-50
p-5
border
border-indigo-100
"


>


<h3 className="
text-xl
font-bold
text-slate-800
">

{session.subject}

</h3>



<p className="
text-slate-600
mt-2
">

{session.topic}

</p>




<div className="
flex
flex-wrap
gap-4
mt-4
text-sm
">


<span className="
flex
items-center
gap-2
text-indigo-600
">

<Clock size={16}/>

{session.duration}

</span>



<span className="
bg-purple-100
px-3
py-1
rounded-full
text-purple-700
font-medium
">

{session.priority}

</span>



</div>




<p className="
mt-4
text-slate-500
italic
">

💡 {session.tips}

</p>



</div>


))

}


</div>


</div>


);

}


export default DayTimeline;