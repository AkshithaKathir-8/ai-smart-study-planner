import { useState } from "react";
import { Search } from "lucide-react";

import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";

import SubjectCard from "../../components/subjects/SubjectCard";
import SubjectStats from "../../components/subjects/SubjectStats";
import AddSubjectButton from "../../components/subjects/AddSubjectButton";
import AddSubjectModal from "../../components/subjects/AddSubjectModal";

import { useSubjects } from "../../context/SubjectContext";


function Subjects() {


  const { subjects, addSubject } = useSubjects();


  const [openModal, setOpenModal] =
    useState(false);


  const [search, setSearch] =
    useState("");



  const handleAddSubject = (newSubject) => {

    addSubject(newSubject);

    setOpenModal(false);

  };





  const filteredSubjects =
    subjects.filter((item) =>

      item.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )

    );



console.log(subjects);

  return (

    <MainLayout>


      <div className="space-y-8">



        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">


          <PageHeader

            title="Subjects"

            subtitle="Manage your academic courses and track your progress."

          />



          <AddSubjectButton

            onClick={() => setOpenModal(true)}

          />


        </div>





        <SubjectStats />





        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">


          <div className="relative">


            <Search

              size={20}

              className="absolute left-4 top-4 text-slate-400"

            />



            <input


              type="text"


              placeholder="Search subjects..."


              value={search}


              onChange={(e)=>

                setSearch(
                  e.target.value
                )

              }


              className="w-full pl-12 pr-5 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"


            />


          </div>


        </div>





        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">


          {filteredSubjects.map((item)=>(


            <SubjectCard


              key={item._id}


              id={item._id}


              subject={item.name}


              code={item.code}


              credits={item.credits}


              color={item.color}


            />


          ))}


        </div>




      </div>





      <AddSubjectModal


        open={openModal}


        onClose={()=>

          setOpenModal(false)

        }


        onSave={handleAddSubject}


      />



    </MainLayout>

  );


}



export default Subjects;