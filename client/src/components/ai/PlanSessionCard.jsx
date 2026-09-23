import { Clock, Flame, BookOpen } from "lucide-react";
import { motion } from "framer-motion";


function PlanSessionCard({session}){


const priorityStyle =
session.priority==="High"
?
"bg-red-100 text-red-600"
:
session.priority==="Medium"
?
"bg-yellow-100 text-yellow-700"
:
"bg-green-100 text-green-700";


return(

<motion.div

whileHover={{y:-5}}

className="
bg-white
rounded-3xl
p-6
shadow-lg
border
border-slate-200
"

>


<div className="flex justify-between">


<div className="flex gap-3">

<div className="
bg-indigo-100
p-3
rounded-2xl
">

<BookOpen
className="text-indigo-600"
/>

</div>


<div>

<h3 className="text-lg font-bold">

{session.subject}

</h3>

<p className="text-slate-500">

{session.topic}

</p>

</div>


</div>


<span
className={`
px-3 py-1
rounded-full
text-sm
font-semibold
${priorityStyle}
`}
>

{session.priority}

</span>


</div>



<div className="
mt-5
flex
gap-6
text-sm
text-slate-600
">


<div className="flex gap-2">

<Clock size={18}/>

{session.time}

</div>


<div>

⌛ {session.duration}

</div>


</div>



<div className="
mt-5
bg-indigo-50
rounded-2xl
p-4
text-indigo-700
">


💡 {session.tips}


</div>



</motion.div>


)

}


export default PlanSessionCard;