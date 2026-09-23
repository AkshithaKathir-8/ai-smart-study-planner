import { useState, useEffect } from "react";
import { X } from "lucide-react";


function EditSubjectModal({
  open,
  onClose,
  subject,
  onUpdate,
}) {


  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [credits, setCredits] = useState("");
  const [color, setColor] = useState("blue");

  const [errors, setErrors] = useState({});



  useEffect(() => {

    if(subject){

      setName(subject.name || "");
      setCode(subject.code || "");
      setCredits(subject.credits || "");
      setColor(subject.color || "blue");

    }

  },[subject]);




  if(!open) return null;




  const handleUpdate = () => {


    const newErrors = {};



    if(!name.trim()){

      newErrors.name =
      "Subject name is required";

    }



    if(!credits || Number(credits)<=0){

      newErrors.credits =
      "Credits must be greater than 0";

    }



    if(Object.keys(newErrors).length > 0){

      setErrors(newErrors);

      return;

    }



    setErrors({});



    onUpdate({

      ...subject,

      name,

      code,

      credits:Number(credits),

      color

    });



    onClose();


  };





  return (

    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">


      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-8">



        <div className="flex justify-between items-center mb-8">


          <h2 className="text-2xl font-bold">

            Edit Subject

          </h2>



          <button

            onClick={onClose}

            className="p-2 rounded-xl hover:bg-slate-100"

          >

            <X size={22}/>

          </button>


        </div>





        <div className="space-y-5">



          <div>

            <input

              value={name}

              onChange={(e)=>setName(e.target.value)}

              placeholder="Subject Name"

              className="w-full rounded-2xl px-4 py-3 border"

            />


            {errors.name &&

              <p className="text-red-500 text-sm">

                {errors.name}

              </p>

            }

          </div>





          <input

            value={code}

            onChange={(e)=>setCode(e.target.value)}

            placeholder="Subject Code"

            className="w-full rounded-2xl px-4 py-3 border"

          />






          <div>


            <input

              type="number"

              value={credits}

              onChange={(e)=>setCredits(e.target.value)}

              placeholder="Credits"

              className="w-full rounded-2xl px-4 py-3 border"

            />



            {errors.credits &&

              <p className="text-red-500 text-sm">

                {errors.credits}

              </p>

            }


          </div>





          <div>


            <label className="block mb-3 font-medium">

              Theme Color

            </label>



            <div className="flex gap-4">


              {
                ["orange","blue","emerald","purple"]
                .map((item)=>(


                  <button

                    key={item}

                    type="button"

                    onClick={()=>setColor(item)}

                    className={`w-10 h-10 rounded-full ${
                      
                      color===item
                      ?"border-4 border-black scale-110"
                      :""

                    }
                    ${
                      item==="orange"
                      ?"bg-orange-500"
                      :item==="blue"
                      ?"bg-blue-500"
                      :item==="emerald"
                      ?"bg-emerald-500"
                      :"bg-purple-500"
                    }`}

                  />


                ))
              }


            </div>


          </div>






          <button

            onClick={handleUpdate}

            className="w-full bg-indigo-600 text-white rounded-2xl py-3 font-semibold hover:bg-indigo-700 transition"

          >

            Update Subject

          </button>



        </div>



      </div>


    </div>

  );

}


export default EditSubjectModal;