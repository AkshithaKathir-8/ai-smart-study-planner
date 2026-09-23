import { motion } from "framer-motion";


function StatsCard({
title,
value,
icon:Icon,
color
}) {


return (

<motion.div

whileHover={{
y:-8,
scale:1.03
}}

className="
relative
overflow-hidden
rounded-3xl
p-6
bg-white/70
backdrop-blur-xl
border
border-white
shadow-xl
"

>


<div

className={`
absolute
inset-0
bg-gradient-to-br
${color}
opacity-10
`}

/>



<div className="relative flex justify-between items-center">


<div>


<p className="text-slate-500 text-sm">

{title}

</p>


<h2 className="text-4xl font-bold text-slate-800 mt-3">

{value}

</h2>


</div>



<div

className={`
p-4
rounded-2xl
bg-gradient-to-br
${color}
shadow-lg
`}

>

<Icon

size={28}

className="text-white"

/>


</div>


</div>


</motion.div>

);

}


export default StatsCard;