import { useState } from "react";
import {
  Search,
  BookOpen,
  GraduationCap,
  Sparkles,
} from "lucide-react";

import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";

import SubjectCard from "../../components/subjects/SubjectCard";
import SubjectStats from "../../components/subjects/SubjectStats";
import AddSubjectButton from "../../components/subjects/AddSubjectButton";
import AddSubjectModal from "../../components/subjects/AddSubjectModal";

import { useSubjects } from "../../context/SubjectContext";

function Subjects() {
  const { subjects, addSubject } = useSubjects();

  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");

  const handleAddSubject = async (newSubject) => {
    await addSubject(newSubject);
    setOpenModal(false);
  };

  const filteredSubjects = subjects.filter((item) =>
    item.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-8 pb-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                <BookOpen
                  size={19}
                  className="text-indigo-600"
                />
              </div>

              <span className="text-sm font-semibold text-indigo-600">
                Academic Hub
              </span>
            </div>

            <PageHeader
              title="Subjects"
              subtitle="Organize your courses, monitor progress, and keep your academic journey on track."
            />
          </div>

          <AddSubjectButton
            onClick={() => setOpenModal(true)}
          />
        </div>

        {/* Overview banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 p-7 text-white shadow-xl shadow-indigo-100">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-indigo-100 text-sm font-medium mb-2">
                Your academic workspace
              </p>

              <h2 className="text-2xl md:text-3xl font-bold">
                Build your semester around every subject.
              </h2>

              <p className="mt-2 text-indigo-100 max-w-2xl text-sm md:text-base">
                Keep your courses organized and quickly access
                the details, progress, and study information for
                each subject.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                <GraduationCap size={25} />
              </div>

              <div>
                <p className="text-xs text-indigo-100">
                  Active subjects
                </p>

                <p className="text-2xl font-bold">
                  {subjects.length}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -right-12 -top-16 w-48 h-48 rounded-full bg-white/10" />
          <div className="absolute right-20 -bottom-24 w-56 h-56 rounded-full bg-white/5" />
        </div>

        {/* Statistics */}
        <SubjectStats />

        {/* Search / controls */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Your Courses
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Search and access your subjects quickly.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />

              <input
                type="text"
                placeholder="Search subjects..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition"
              />
            </div>
          </div>
        </div>

        {/* Subject section */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <BookOpen
                  size={17}
                  className="text-indigo-600"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  All Subjects
                </h2>

                <p className="text-sm text-slate-500 mt-0.5">
                  {filteredSubjects.length} subject
                  {filteredSubjects.length !== 1
                    ? "s"
                    : ""}{" "}
                  displayed
                </p>
              </div>
            </div>

            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Clear search
              </button>
            )}
          </div>

          {filteredSubjects.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-3xl py-16 px-6 text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
                {search ? (
                  <Search
                    size={29}
                    className="text-indigo-500"
                  />
                ) : (
                  <BookOpen
                    size={29}
                    className="text-indigo-500"
                  />
                )}
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-800">
                {search
                  ? "No subjects found"
                  : "No subjects yet"}
              </h3>

              <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
                {search
                  ? `We couldn't find a subject matching "${search}".`
                  : "Add your first subject to start organizing your academic workspace."}
              </p>

              {!search && (
                <button
                  onClick={() => setOpenModal(true)}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                >
                  <Sparkles size={17} />
                  Add Your First Subject
                </button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
              {filteredSubjects.map((item) => (
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
          )}
        </div>
      </div>

      <AddSubjectModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleAddSubject}
      />
    </MainLayout>
  );
}

export default Subjects;