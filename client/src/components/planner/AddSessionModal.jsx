import { useState } from "react";
import {
  X,
  CalendarDays,
  Clock3,
  BookOpen,
  Sparkles,
} from "lucide-react";

import { useSubjects } from "../../context/SubjectContext";
import { usePlanner } from "../../context/PlannerContext";

function AddSessionModal({
  open,
  onClose,
}) {
  const { subjects } = useSubjects();
  const { addSession } = usePlanner();

  const initialState = {
    subjectId: "",
    topic: "",
    examDate: "",
    studyDate: "",
    startTime: "",
    endTime: "",
    difficulty: "Medium",
    priority: "Medium",
    aiRecommendation: "",
  };

  const [formData, setFormData] =
    useState(initialState);

  if (!open) return null;

  // ---------------------------------------
  // Format date input as YYYY-MM-DD
  // ---------------------------------------

  const formatDateInput = (value) => {
    // Keep numbers only
    const numbersOnly = value.replace(/\D/g, "");

    // Maximum:
    // YYYYMMDD = 8 digits
    const limited = numbersOnly.slice(0, 8);

    let result = limited;

    if (limited.length > 4) {
      result =
        limited.slice(0, 4) +
        "-" +
        limited.slice(4);
    }

    if (limited.length > 6) {
      result =
        limited.slice(0, 4) +
        "-" +
        limited.slice(4, 6) +
        "-" +
        limited.slice(6, 8);
    }

    return result;
  };

  // ---------------------------------------
  // Handle form changes
  // ---------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      name === "examDate" ||
      name === "studyDate"
    ) {
      const formattedDate =
        formatDateInput(value);

      setFormData((previous) => ({
        ...previous,
        [name]: formattedDate,
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ---------------------------------------
  // Generate recommendation
  // ---------------------------------------

  const generateRecommendation = () => {
  const selectedSubject = subjects.find(
    (subject) => subject._id === formData.subjectId
  );

  const subjectName =
    selectedSubject?.name ||
    selectedSubject?.subject ||
    "this subject";

  let recommendation = "";

  // Difficulty-based study strategy
  if (formData.difficulty === "Hard") {
    recommendation = `For ${subjectName} - ${formData.topic.trim()}, use an active-learning approach: spend the first part of the session revising the core concepts, then solve practice problems without referring to notes.`;
  } else if (formData.difficulty === "Medium") {
    recommendation = `For ${subjectName} - ${formData.topic.trim()}, begin with a quick concept revision and then practice key questions to strengthen your understanding.`;
  } else {
    recommendation = `For ${subjectName} - ${formData.topic.trim()}, focus on understanding the fundamentals first and finish with a few simple practice questions.`;
  }

  // Priority-based adjustment
  if (formData.priority === "High") {
    recommendation +=
      " Since this session has high priority, avoid passive reading and focus on active recall and problem-solving.";
  } else if (formData.priority === "Low") {
    recommendation +=
      " Since this is a lower-priority session, focus on steady progress rather than trying to cover everything at once.";
  }

  // Exam-date awareness
  if (formData.examDate && formData.studyDate) {
    const exam = new Date(formData.examDate);
    const study = new Date(formData.studyDate);

    const difference =
      Math.ceil(
        (exam - study) /
          (1000 * 60 * 60 * 24)
      );

    if (difference >= 0 && difference <= 3) {
      recommendation +=
        " The exam is very close, so prioritize revision, important questions, and timed practice.";
    } else if (difference >= 4 && difference <= 7) {
      recommendation +=
        " With about a week before the exam, balance concept revision with practice questions and quick self-testing.";
    } else if (difference > 7) {
      recommendation +=
        " Since there is more preparation time available, build understanding first and gradually increase practice difficulty.";
    }
  }

  // Session-time awareness
  if (formData.startTime && formData.endTime) {
    const [startHour, startMinute] =
      formData.startTime.split(":").map(Number);

    const [endHour, endMinute] =
      formData.endTime.split(":").map(Number);

    let duration =
      endHour * 60 +
      endMinute -
      (startHour * 60 + startMinute);

    if (duration > 0) {
      if (duration <= 30) {
        recommendation +=
          " This is a short session, so focus on one specific subtopic and avoid switching between multiple concepts.";
      } else if (duration <= 60) {
        recommendation +=
          " Use the session for focused revision followed by a short set of practice questions.";
      } else {
        recommendation +=
          " Since you have a longer session, divide it into focused study blocks with a short break between them.";
      }
    }
  }

  setFormData((previous) => ({
    ...previous,
    aiRecommendation: recommendation,
  }));
};

  // ---------------------------------------
  // Validate date
  // ---------------------------------------

  const isValidDate = (value) => {
    if (!value) return false;

    // Must be exactly YYYY-MM-DD
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
      return false;
    }

    const [year, month, day] =
      value.split("-").map(Number);

    if (
      year < 1000 ||
      year > 9999
    ) {
      return false;
    }

    if (
      month < 1 ||
      month > 12
    ) {
      return false;
    }

    if (
      day < 1 ||
      day > 31
    ) {
      return false;
    }

    const date = new Date(
      year,
      month - 1,
      day
    );

    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

  // ---------------------------------------
  // Submit
  // ---------------------------------------

  const handleSubmit = async () => {
    if (
      !formData.subjectId ||
      !formData.topic.trim() ||
      !formData.examDate ||
      !formData.studyDate
    ) {
      alert(
        "Please fill Subject, Topic, Exam Date and Study Date"
      );

      return;
    }

    if (!isValidDate(formData.examDate)) {
      alert(
        "Please enter a valid Exam Date."
      );

      return;
    }

    if (!isValidDate(formData.studyDate)) {
      alert(
        "Please enter a valid Study Date."
      );

      return;
    }

    if (
      formData.startTime &&
      formData.endTime &&
      formData.endTime <= formData.startTime
    ) {
      alert(
        "End Time must be later than Start Time."
      );

      return;
    }

    await addSession({
      ...formData,
      topic: formData.topic.trim(),
    });

    setFormData(initialState);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Backdrop */}

      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}

      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 px-7 py-7 text-white">

          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />

          <div className="absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-white/5" />

          <div className="relative flex items-start justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                <CalendarDays size={23} />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Add Study Session
                </h2>

                <p className="mt-1 text-sm text-indigo-100">
                  Plan your next focused study session
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
            >
              <X size={19} />
            </button>

          </div>

          <div className="relative mt-5 flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm text-indigo-50 backdrop-blur-sm">

            <Sparkles size={16} />

            Organize your study time and stay consistent

          </div>

        </div>

        {/* Form */}

        <div className="space-y-6 p-7">

          {/* Subject */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Subject
            </label>

            <div className="relative">

              <BookOpen
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                name="subjectId"
                value={formData.subjectId}
                onChange={handleChange}
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              >
                <option value="">
                  Select Subject
                </option>

                {subjects.map((subject) => (
                  <option
                    key={subject._id}
                    value={subject._id}
                  >
                    {subject.name || subject.subject}
                  </option>
                ))}
              </select>

            </div>

          </div>

          {/* Topic */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Topic
            </label>

            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="e.g. Binary Trees"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />

          </div>

          {/* Dates */}

          <div className="grid gap-5 sm:grid-cols-2">

            {/* Exam Date */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Exam Date
              </label>

              <input
                type="text"
                name="examDate"
                value={formData.examDate}
                onChange={handleChange}
                placeholder="YYYY-MM-DD"
                inputMode="numeric"
                maxLength={10}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />

            </div>

            {/* Study Date */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Study Date
              </label>

              <input
                type="text"
                name="studyDate"
                value={formData.studyDate}
                onChange={handleChange}
                placeholder="YYYY-MM-DD"
                inputMode="numeric"
                maxLength={10}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />

            </div>

          </div>

          {/* Time */}

          <div className="grid gap-5 sm:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Start Time
              </label>

              <div className="relative">

                <Clock3
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />

              </div>

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                End Time
              </label>

              <div className="relative">

                <Clock3
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />

              </div>

            </div>

          </div>

          {/* Difficulty */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Difficulty
            </label>

            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
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

          </div>

          {/* Priority */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Priority
            </label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
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

          </div>

          {/* AI Recommendation */}

          <button
            type="button"
            onClick={generateRecommendation}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 to-purple-100 px-5 py-3.5 text-sm font-semibold text-violet-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Sparkles
              size={17}
              className="text-violet-600 transition-transform group-hover:scale-110"
            />

            Generate AI Recommendation
          </button>

          {formData.aiRecommendation && (
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-5">

              <div className="flex gap-3">

                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">

                  <Sparkles
                    size={17}
                    className="text-indigo-600"
                  />

                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                    AI Recommendation
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {formData.aiRecommendation}
                  </p>

                </div>

              </div>

            </div>
          )}

          {/* Buttons */}

          <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">

            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-300"
            >
              Save Study Session
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default AddSessionModal;