import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  Trophy,
  Target,
  TrendingUp,
  CalendarDays,
  Loader2,
  BookOpen,
  ChevronDown,
  CheckCircle2,
  XCircle,
  BarChart3,
} from "lucide-react";

import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ai/StatCard";
import { getQuizzes } from "../../services/aiService";

function QuizHistory() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedQuiz, setExpandedQuiz] = useState(null);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getQuizzes();

        setQuizzes(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Unable to load quiz history."
        );
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, []);

  const stats = useMemo(() => {
    if (quizzes.length === 0) {
      return {
        total: 0,
        average: 0,
        best: 0,
        latest: 0,
      };
    }

    const percentages = quizzes.map((quiz) =>
      Number(quiz.percentage || 0)
    );

    const total = quizzes.length;

    const average = Math.round(
      percentages.reduce((sum, value) => sum + value, 0) /
        total
    );

    const best = Math.max(...percentages);

    const latest = percentages[0];

    return {
      total,
      average,
      best,
      latest,
    };
  }, [quizzes]);

  const subjectPerformance = useMemo(() => {
    const grouped = {};

    quizzes.forEach((quiz) => {
      const subjectName =
        quiz.subjectId?.name || "Unknown Subject";

      if (!grouped[subjectName]) {
        grouped[subjectName] = {
          total: 0,
          score: 0,
        };
      }

      grouped[subjectName].total += 1;
      grouped[subjectName].score += Number(
        quiz.percentage || 0
      );
    });

    return Object.entries(grouped)
      .map(([subject, data]) => ({
        subject,
        quizzes: data.total,
        average: Math.round(data.score / data.total),
      }))
      .sort((a, b) => b.average - a.average);
  }, [quizzes]);

  const formatDate = (date) => {
    if (!date) return "Unknown date";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const toggleQuiz = (quizId) => {
    setExpandedQuiz((current) =>
      current === quizId ? null : quizId
    );
  };

  return (
    <MainLayout>
      <div className="space-y-8">

        <PageHeader
          title="Quiz History"
          subtitle="Review your completed AI quizzes and track your performance."
        />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading quiz history...
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5">
            {error}
          </div>
        ) : (
          <>
            {/* =====================================================
                OVERALL QUIZ STATISTICS
            ====================================================== */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

              <StatCard
                title="Total Quizzes"
                value={stats.total}
                icon={
                  <ClipboardCheck className="w-6 h-6" />
                }
                color="bg-indigo-100 text-indigo-600"
              />

              <StatCard
                title="Average Score"
                value={`${stats.average}%`}
                icon={
                  <TrendingUp className="w-6 h-6" />
                }
                color="bg-blue-100 text-blue-600"
              />

              <StatCard
                title="Best Score"
                value={`${stats.best}%`}
                icon={<Trophy className="w-6 h-6" />}
                color="bg-amber-100 text-amber-600"
              />

              <StatCard
                title="Latest Score"
                value={`${stats.latest}%`}
                icon={<Target className="w-6 h-6" />}
                color="bg-emerald-100 text-emerald-600"
              />

            </div>

            {/* =====================================================
                SUBJECT PERFORMANCE
            ====================================================== */}

            {subjectPerformance.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

                <div className="p-6 border-b border-slate-200">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5" />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-slate-800">
                        Subject-wise Performance
                      </h2>

                      <p className="text-sm text-slate-500">
                        Compare your average quiz performance across subjects.
                      </p>
                    </div>

                  </div>

                </div>

                <div className="p-6 space-y-5">

                  {subjectPerformance.map((item) => (
                    <div key={item.subject}>

                      <div className="flex items-center justify-between mb-2">

                        <div>
                          <p className="font-medium text-slate-700">
                            {item.subject}
                          </p>

                          <p className="text-xs text-slate-400">
                            {item.quizzes}{" "}
                            {item.quizzes === 1
                              ? "quiz"
                              : "quizzes"}
                          </p>
                        </div>

                        <span className="font-semibold text-slate-700">
                          {item.average}%
                        </span>

                      </div>

                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${item.average}%`,
                          }}
                          transition={{
                            duration: 0.7,
                          }}
                          className={`h-full rounded-full ${
                            item.average >= 80
                              ? "bg-emerald-500"
                              : item.average >= 50
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}
                        />

                      </div>

                    </div>
                  ))}

                </div>

              </div>
            )}

            {/* =====================================================
                QUIZ HISTORY
            ====================================================== */}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

              <div className="p-6 border-b border-slate-200">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <ClipboardCheck className="w-5 h-5" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">
                      Recent Quiz Attempts
                    </h2>

                    <p className="text-sm text-slate-500">
                      Click an attempt to view the complete result.
                    </p>
                  </div>

                </div>

              </div>

              {quizzes.length === 0 ? (
                <div className="p-12 text-center">

                  <BookOpen className="w-12 h-12 mx-auto text-slate-300" />

                  <h3 className="mt-4 text-lg font-semibold text-slate-700">
                    No quizzes completed yet
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Complete an AI quiz to see your results here.
                  </p>

                </div>
              ) : (
                <div className="divide-y divide-slate-100">

                  {quizzes.map((quiz, index) => {

                    const percentage = Number(
                      quiz.percentage || 0
                    );

                    const isExpanded =
                      expandedQuiz === quiz._id;

                    return (
                      <motion.div
                        key={quiz._id}
                        initial={{
                          opacity: 0,
                          y: 10,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: index * 0.05,
                        }}
                      >

                        {/* Quiz summary */}

                        <button
                          type="button"
                          onClick={() =>
                            toggleQuiz(quiz._id)
                          }
                          className="w-full text-left p-5 hover:bg-slate-50 transition"
                        >

                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                            <div className="flex items-start gap-4">

                              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                <BookOpen className="w-5 h-5" />
                              </div>

                              <div>

                                <h3 className="font-semibold text-slate-800">
                                  {quiz.subjectId?.name ||
                                    "Unknown Subject"}
                                </h3>

                                <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-500">

                                  <span className="flex items-center gap-1">
                                    <CalendarDays className="w-4 h-4" />
                                    {formatDate(
                                      quiz.createdAt
                                    )}
                                  </span>

                                  <span>
                                    {quiz.score || 0}/
                                    {quiz.totalQuestions || 0}{" "}
                                    correct
                                  </span>

                                </div>

                              </div>

                            </div>

                            <div className="flex items-center gap-5">

                              <div className="w-32">

                                <div className="flex justify-between text-xs mb-1">

                                  <span className="text-slate-500">
                                    Performance
                                  </span>

                                  <span className="font-semibold text-slate-700">
                                    {percentage}%
                                  </span>

                                </div>

                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

                                  <div
                                    className={`h-full rounded-full ${
                                      percentage >= 80
                                        ? "bg-emerald-500"
                                        : percentage >= 50
                                        ? "bg-amber-500"
                                        : "bg-red-500"
                                    }`}
                                    style={{
                                      width: `${percentage}%`,
                                    }}
                                  />

                                </div>

                              </div>

                              <ChevronDown
                                className={`w-5 h-5 text-slate-400 transition-transform ${
                                  isExpanded
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />

                            </div>

                          </div>

                        </button>

                        {/* =================================================
                            QUIZ DETAILS
                        ================================================== */}

                        {isExpanded && (
                          <div className="px-5 pb-6">

                            <div className="ml-0 md:ml-15 bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-5">

                              <div className="flex items-center justify-between">

                                <div>
                                  <h4 className="font-semibold text-slate-800">
                                    Quiz Result
                                  </h4>

                                  <p className="text-sm text-slate-500 mt-1">
                                    {quiz.score || 0} out of{" "}
                                    {quiz.totalQuestions || 0}{" "}
                                    answers correct
                                  </p>
                                </div>

                                <div
                                  className={`text-2xl font-bold ${
                                    percentage >= 80
                                      ? "text-emerald-600"
                                      : percentage >= 50
                                      ? "text-amber-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {percentage}%
                                </div>

                              </div>

                              <div className="space-y-4">

                                {quiz.questions?.map(
                                  (question, questionIndex) => {

                                    const isCorrect =
                                      question.selectedAnswer ===
                                      question.correctAnswer;

                                    return (
                                      <div
                                        key={questionIndex}
                                        className="bg-white rounded-xl border border-slate-200 p-4"
                                      >

                                        <div className="flex items-start gap-3">

                                          {isCorrect ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                                          ) : (
                                            <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                                          )}

                                          <div className="flex-1">

                                            <p className="font-medium text-slate-800">
                                              {questionIndex + 1}.{" "}
                                              {question.question}
                                            </p>

                                            <div className="mt-3 grid gap-2">

                                              <div className="text-sm">

                                                <span className="text-slate-500">
                                                  Your answer:
                                                </span>{" "}

                                                <span
                                                  className={
                                                    isCorrect
                                                      ? "text-emerald-600 font-medium"
                                                      : "text-red-600 font-medium"
                                                  }
                                                >
                                                  {question.selectedAnswer ||
                                                    "Not answered"}
                                                </span>

                                              </div>

                                              {!isCorrect && (
                                                <div className="text-sm">

                                                  <span className="text-slate-500">
                                                    Correct answer:
                                                  </span>{" "}

                                                  <span className="text-emerald-600 font-medium">
                                                    {question.correctAnswer}
                                                  </span>

                                                </div>
                                              )}

                                            </div>

                                          </div>

                                        </div>

                                      </div>
                                    );
                                  }
                                )}

                              </div>

                            </div>

                          </div>
                        )}

                      </motion.div>
                    );
                  })}

                </div>
              )}

            </div>

          </>
        )}

      </div>
    </MainLayout>
  );
}

export default QuizHistory;