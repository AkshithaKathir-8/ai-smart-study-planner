import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

import EditSubjectModal from "../../components/subjects/EditSubjectModal";

import { useSubjects } from "../../context/SubjectContext";
import { usePlanner } from "../../context/PlannerContext";

function SubjectDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const {
    subjects,
    updateSubject,
    deleteSubject,
  } = useSubjects();

  const {
    sessions,
  } = usePlanner();

  const [openEditModal, setOpenEditModal] = useState(false);

  const currentSubject = subjects.find(
    (item) => item._id === id
  );

  if (!currentSubject) {

    return (

      <MainLayout>

        <h1 className="text-2xl font-bold p-10">

          Subject Not Found

        </h1>

      </MainLayout>

    );

  }

  // -----------------------------
  // Planner Sessions for this subject
  // -----------------------------

  const subjectTasks = sessions.filter((session) => {

    if (!session.subjectId) return false;

    const plannerSubjectId =
      typeof session.subjectId === "object"
        ? session.subjectId._id
        : session.subjectId;

    return plannerSubjectId === currentSubject._id;

  });

  const handleUpdate = (updatedSubject) => {

    updateSubject(updatedSubject);

  };

  const handleDelete = () => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this subject?"
    );

    if (!confirmDelete) return;

    deleteSubject(currentSubject._id);

    navigate("/subjects");

  };

  return (

    <MainLayout>

      <div className="space-y-8">

        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">

          <PageHeader
            title={currentSubject.name}
            subtitle="Track your progress and planner sessions."
          />

          <div className="flex gap-3">

            <button
              onClick={() => setOpenEditModal(true)}
              className="px-5 py-3 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Edit Subject
            </button>

            <button
              onClick={handleDelete}
              className="px-5 py-3 rounded-2xl bg-red-500 text-white hover:bg-red-600 transition"
            >
              Delete
            </button>

          </div>

        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">

            <h2 className="text-2xl font-bold text-slate-800">

              Subject Overview

            </h2>

            <div className="grid md:grid-cols-2 gap-6 mt-8">

              <div>

                <p className="text-slate-500">
                  Subject Code
                </p>

                <h3 className="text-lg font-semibold mt-1">

                  {currentSubject.code || "Not Added"}

                </h3>

              </div>

              <div>

                <p className="text-slate-500">
                  Credits
                </p>

                <h3 className="text-lg font-semibold mt-1">

                  {currentSubject.credits}

                </h3>

              </div>

            </div>

          </div>

          {/* Planner */}

          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">

            <h2 className="text-xl font-bold">

              Upcoming Study Sessions

            </h2>

            <div className="mt-6 space-y-4">

              {subjectTasks.length === 0 ? (

                <div className="text-center py-10">

                  <div className="text-5xl">
                    📚
                  </div>

                  <h3 className="text-lg font-bold mt-4">

                    No Study Sessions

                  </h3>

                </div>

              ) : (

                subjectTasks.map((task) => (

                  <div
                    key={task._id}
                    className="border rounded-2xl p-4 hover:border-indigo-300 transition"
                  >

                    <h3 className="font-semibold">

                      {task.topic}

                    </h3>

                    <p className="text-sm text-slate-500 mt-2">

                      Study Date :
                      {" "}
                      {new Date(task.studyDate).toLocaleDateString()}

                    </p>

                    <p className="text-sm text-slate-500">

                      Exam Date :
                      {" "}
                      {new Date(task.examDate).toLocaleDateString()}

                    </p>

                    <p className="text-sm text-slate-500">

                      {task.startTime} - {task.endTime}

                    </p>

                    <div className="flex gap-2 mt-3">

                      <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs">

                        {task.difficulty}

                      </span>

                      <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs">

                        {task.priority}

                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          task.status === "Completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >

                        {task.status}

                      </span>

                    </div>

                  </div>

                ))

              )}

            </div>

          </div>

        </div>

      </div>

      <EditSubjectModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        subject={currentSubject}
        onUpdate={handleUpdate}
      />

    </MainLayout>

  );

}

export default SubjectDetails;