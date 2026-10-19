import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";

import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  BookOpen,
  GraduationCap,
  Hash,
  CalendarDays,
  Clock3,
  Pencil,
  Trash2,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Circle,
} from "lucide-react";

import EditSubjectModal from "../../components/subjects/EditSubjectModal";

import { useSubjects } from "../../context/SubjectContext";
import { usePlanner } from "../../context/PlannerContext";

function SubjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { subjects, updateSubject, deleteSubject } = useSubjects();
  const { sessions } = usePlanner();

  const [openEditModal, setOpenEditModal] = useState(false);

  const currentSubject = subjects.find(
    (item) => item._id === id
  );

  if (!currentSubject) {
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] items-center justify-center px-6">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
              <BookOpen
                size={30}
                className="text-indigo-600"
              />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-800">
              Subject Not Found
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              This subject may have been deleted or is no longer available.
            </p>

            <button
              onClick={() => navigate("/subjects")}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <ArrowLeft size={17} />
              Back to Subjects
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // ---------------------------------------
  // Planner Sessions for this subject
  // ---------------------------------------

  const subjectTasks = sessions
    .filter((session) => {
      if (!session.subjectId) return false;

      const plannerSubjectId =
        typeof session.subjectId === "object"
          ? session.subjectId._id
          : session.subjectId;

      return plannerSubjectId === currentSubject._id;
    })
    .sort(
      (a, b) =>
        new Date(a.studyDate) -
        new Date(b.studyDate)
    );

  // ---------------------------------------
  // Statistics
  // ---------------------------------------

  const completedSessions = subjectTasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingSessions = subjectTasks.filter(
    (task) => task.status !== "Completed"
  ).length;

  const completionPercentage =
    subjectTasks.length > 0
      ? Math.round(
          (completedSessions / subjectTasks.length) * 100
        )
      : 0;

  // ---------------------------------------
  // Handlers
  // ---------------------------------------

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

  // ---------------------------------------
  // Helpers
  // ---------------------------------------

  const formatDate = (date) => {
    if (!date) return "Not set";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getDifficultyStyle = (difficulty) => {
    if (difficulty === "Hard") {
      return "bg-red-50 text-red-700 border-red-100";
    }

    if (difficulty === "Easy") {
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    }

    return "bg-indigo-50 text-indigo-700 border-indigo-100";
  };

  const getPriorityStyle = (priority) => {
    if (priority === "High") {
      return "bg-orange-50 text-orange-700 border-orange-100";
    }

    if (priority === "Low") {
      return "bg-slate-50 text-slate-600 border-slate-200";
    }

    return "bg-violet-50 text-violet-700 border-violet-100";
  };

  return (
    <MainLayout>
      <div className="space-y-8">

        {/* -------------------------------- */}
        {/* Header */}
        {/* -------------------------------- */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-start gap-4">

            <button
              onClick={() => navigate("/subjects")}
              className="mt-1 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
              title="Back to Subjects"
            >
              <ArrowLeft size={19} />
            </button>

            <PageHeader
              title={currentSubject.name}
              subtitle="Track your academic progress and study sessions."
            />

          </div>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={() => setOpenEditModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl border border-indigo-200 bg-white px-5 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-50 hover:shadow-md"
            >
              <Pencil size={17} />
              Edit Subject
            </button>

            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-100 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Trash2 size={17} />
              Delete
            </button>

          </div>

        </div>

        {/* -------------------------------- */}
        {/* Subject Hero */}
        {/* -------------------------------- */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 p-7 text-white shadow-xl shadow-indigo-100">

          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-white/5" />

          <div className="relative">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-center gap-5">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 shadow-inner backdrop-blur-sm">
                  <BookOpen size={31} />
                </div>

                <div>

                  <p className="text-sm font-medium text-indigo-100">
                    Academic Subject
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    {currentSubject.name}
                  </h2>

                  <div className="mt-2 flex flex-wrap items-center gap-2">

                    {currentSubject.code && (
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-indigo-50 backdrop-blur-sm">
                        {currentSubject.code}
                      </span>
                    )}

                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-indigo-50 backdrop-blur-sm">
                      {currentSubject.credits} Credits
                    </span>

                  </div>

                </div>

              </div>

              <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-sm">

                <p className="text-xs font-medium text-indigo-100">
                  Study Progress
                </p>

                <div className="mt-1 flex items-end gap-2">
                  <span className="text-3xl font-bold">
                    {completionPercentage}%
                  </span>

                  <span className="pb-1 text-xs text-indigo-100">
                    sessions completed
                  </span>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* -------------------------------- */}
        {/* Stats */}
        {/* -------------------------------- */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50">
                <CalendarDays
                  size={21}
                  className="text-indigo-600"
                />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Sessions
              </span>

            </div>

            <p className="mt-5 text-3xl font-bold text-slate-800">
              {subjectTasks.length}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Total study sessions
            </p>

          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50">
                <CheckCircle2
                  size={21}
                  className="text-emerald-600"
                />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Completed
              </span>

            </div>

            <p className="mt-5 text-3xl font-bold text-slate-800">
              {completedSessions}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Sessions completed
            </p>

          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50">
                <Circle
                  size={21}
                  className="text-amber-600"
                />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Pending
              </span>

            </div>

            <p className="mt-5 text-3xl font-bold text-slate-800">
              {pendingSessions}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Sessions remaining
            </p>

          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50">
                <GraduationCap
                  size={21}
                  className="text-violet-600"
                />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Credits
              </span>

            </div>

            <p className="mt-5 text-3xl font-bold text-slate-800">
              {currentSubject.credits || 0}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Academic credits
            </p>

          </div>

        </div>

        {/* -------------------------------- */}
        {/* Main Content */}
        {/* -------------------------------- */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* Subject Overview */}

          <div className="lg:col-span-1">

            <div className="h-full rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                  <Sparkles
                    size={19}
                    className="text-indigo-600"
                  />
                </div>

                <div>
                  <h2 className="font-bold text-slate-800">
                    Subject Overview
                  </h2>

                  <p className="text-xs text-slate-400">
                    Academic information
                  </p>
                </div>

              </div>

              <div className="mt-7 space-y-5">

                <div className="rounded-2xl bg-slate-50 p-4">

                  <div className="flex items-center gap-3">

                    <Hash
                      size={18}
                      className="text-indigo-500"
                    />

                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Subject Code
                      </p>

                      <p className="mt-1 font-semibold text-slate-800">
                        {currentSubject.code || "Not Added"}
                      </p>
                    </div>

                  </div>

                </div>

                <div className="rounded-2xl bg-slate-50 p-4">

                  <div className="flex items-center gap-3">

                    <GraduationCap
                      size={18}
                      className="text-violet-500"
                    />

                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Credits
                      </p>

                      <p className="mt-1 font-semibold text-slate-800">
                        {currentSubject.credits || 0}
                      </p>
                    </div>

                  </div>

                </div>

                <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 p-4">

                  <p className="text-xs font-medium text-indigo-500">
                    Session Completion
                  </p>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
                      style={{
                        width: `${completionPercentage}%`,
                      }}
                    />

                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    {completedSessions} of{" "}
                    {subjectTasks.length} sessions completed
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* Study Sessions */}

          <div className="lg:col-span-2">

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <h2 className="text-xl font-bold text-slate-800">
                    Upcoming Study Sessions
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Your planned study activities for this subject.
                  </p>

                </div>

                <span className="inline-flex w-fit rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                  {subjectTasks.length}{" "}
                  {subjectTasks.length === 1
                    ? "Session"
                    : "Sessions"}
                </span>

              </div>

              <div className="mt-6 space-y-4">

                {subjectTasks.length === 0 ? (

                  <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                      <BookOpen
                        size={28}
                        className="text-slate-400"
                      />
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-700">
                      No Study Sessions
                    </h3>

                    <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                      No planner sessions have been created for this subject yet.
                    </p>

                    <button
                      onClick={() => navigate("/planner")}
                      className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition hover:-translate-y-0.5 hover:shadow-xl"
                    >
                      <CalendarDays size={17} />
                      Open Study Planner
                    </button>

                  </div>

                ) : (

                  subjectTasks.map((task) => (

                    <div
                      key={task._id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                    >

                      <div className="flex flex-col gap-4">

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                          <div>

                            <div className="flex items-start gap-3">

                              <div
                                className={`mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${
                                  task.status === "Completed"
                                    ? "bg-emerald-50"
                                    : "bg-indigo-50"
                                }`}
                              >

                                {task.status ===
                                "Completed" ? (
                                  <CheckCircle2
                                    size={18}
                                    className="text-emerald-600"
                                  />
                                ) : (
                                  <BookOpen
                                    size={18}
                                    className="text-indigo-600"
                                  />
                                )}

                              </div>

                              <div>

                                <h3 className="font-bold text-slate-800">
                                  {task.topic}
                                </h3>

                                <p className="mt-1 text-xs text-slate-400">
                                  Study Session
                                </p>

                              </div>

                            </div>

                          </div>

                          <span
                            className={`w-fit rounded-full border px-3 py-1.5 text-xs font-semibold ${
                              task.status === "Completed"
                                ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                                : "border-amber-100 bg-amber-50 text-amber-700"
                            }`}
                          >
                            {task.status}
                          </span>

                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">

                          <div className="rounded-xl bg-slate-50 p-3">

                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <CalendarDays size={14} />
                              Study Date
                            </div>

                            <p className="mt-1 text-sm font-semibold text-slate-700">
                              {formatDate(task.studyDate)}
                            </p>

                          </div>

                          <div className="rounded-xl bg-slate-50 p-3">

                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <CalendarDays size={14} />
                              Exam Date
                            </div>

                            <p className="mt-1 text-sm font-semibold text-slate-700">
                              {formatDate(task.examDate)}
                            </p>

                          </div>

                          <div className="rounded-xl bg-slate-50 p-3">

                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <Clock3 size={14} />
                              Time
                            </div>

                            <p className="mt-1 text-sm font-semibold text-slate-700">
                              {task.startTime || "--"}{" "}
                              -{" "}
                              {task.endTime || "--"}
                            </p>

                          </div>

                        </div>

                        <div className="flex flex-wrap gap-2">

                          <span
                            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${getDifficultyStyle(
                              task.difficulty
                            )}`}
                          >
                            {task.difficulty || "Medium"}
                          </span>

                          <span
                            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${getPriorityStyle(
                              task.priority
                            )}`}
                          >
                            {task.priority || "Medium"} Priority
                          </span>

                        </div>

                      </div>

                    </div>

                  ))

                )}

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* -------------------------------- */}
      {/* Edit Subject Modal */}
      {/* -------------------------------- */}

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