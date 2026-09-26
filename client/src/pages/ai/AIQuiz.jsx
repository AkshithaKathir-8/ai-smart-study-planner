import { useState } from "react";
import {
  generateQuiz as generateQuizAPI,
  saveQuiz,
} from "../../services/aiService";
import { useSubjects } from "../../context/SubjectContext";

function AIQuiz() {
  const { subjects, loading: subjectsLoading } = useSubjects();

  const [subjectId, setSubjectId] = useState("");
  const [topic, setTopic] = useState("");

  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});

  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [error, setError] = useState("");

  const selectedSubject = subjects.find(
    (subject) => subject._id === subjectId
  );

  const generateQuiz = async () => {
    if (!subjectId) {
      setError("Please select a subject.");
      return;
    }

    setGenerating(true);
    setError("");
    setQuiz([]);
    setAnswers({});
    setScore(null);
    setSubmitted(false);
    setSaved(false);

    try {
      const response = await generateQuizAPI({
        subject: selectedSubject.name,
        topic: topic.trim(),
        difficulty: "Medium",
        count: 5,
      });

      if (
        !response ||
        !Array.isArray(response.quiz) ||
        response.quiz.length === 0
      ) {
        throw new Error("The AI did not return any questions.");
      }

      const formattedQuiz = response.quiz.map((question) => ({
        question: question.question,
        options: question.options,
        correctAnswer: question.answer,
        explanation: question.explanation || "",
      }));

      setQuiz(formattedQuiz);
    } catch (err) {
      console.error("Quiz generation failed:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to generate quiz."
      );
    } finally {
      setGenerating(false);
    }
  };

  const selectAnswer = (questionIndex, option) => {
    setAnswers((previous) => ({
      ...previous,
      [questionIndex]: option,
    }));
  };

  const checkAnswers = async () => {
    if (Object.keys(answers).length !== quiz.length) {
      setError("Please answer every question before submitting.");
      return;
    }

    let marks = 0;

    quiz.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        marks++;
      }
    });

    setScore(marks);
    setSubmitted(true);
    setError("");
    setSaving(true);

    try {
      await saveQuiz({
        subjectId,
        score: marks,
        totalQuestions: quiz.length,
        questions: quiz.map((question, index) => ({
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer,
          selectedAnswer: answers[index],
        })),
      });

      setSaved(true);
    } catch (err) {
      console.error("Saving quiz failed:", err);

      setError(
        "Your score was calculated, but the quiz could not be saved. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const tryAgain = () => {
    setAnswers({});
    setScore(null);
    setSubmitted(false);
    setSaved(false);
    setError("");
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-indigo-600">
          🧠 AI Quiz Generator
        </h1>

        <p className="mt-2 text-slate-500">
          Generate a quiz, test your knowledge, and save your results.
        </p>
      </div>

      <div className="mb-6 rounded-3xl bg-white p-6 shadow">
        <label className="mb-2 block font-medium text-slate-700">
          Subject
        </label>

        <select
          className="mb-4 w-full rounded-xl border border-slate-300 p-3"
          value={subjectId}
          onChange={(event) => setSubjectId(event.target.value)}
          disabled={subjectsLoading || generating}
        >
          <option value="">
            {subjectsLoading
              ? "Loading subjects..."
              : "Select a subject"}
          </option>

          {subjects.map((subject) => (
            <option key={subject._id} value={subject._id}>
              {subject.name}
            </option>
          ))}
        </select>

        <label className="mb-2 block font-medium text-slate-700">
          Topic (optional)
        </label>

        <input
          className="mb-4 w-full rounded-xl border border-slate-300 p-3"
          placeholder="Enter a topic, for example: DBMS Normalization"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          disabled={generating}
        />

        <button
          onClick={generateQuiz}
          disabled={generating || subjectsLoading || subjects.length === 0}
          className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {generating ? "Generating..." : "Generate Quiz"}
        </button>

        {!subjectsLoading && subjects.length === 0 && (
          <p className="mt-3 text-sm text-amber-700">
            Add a subject in Kortex before generating a quiz.
          </p>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {quiz.length > 0 && (
        <div className="rounded-3xl bg-white p-6 shadow">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              {selectedSubject?.name}
              {topic.trim() ? ` — ${topic}` : ""}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {quiz.length} questions · Medium difficulty
            </p>
          </div>

          {quiz.map((question, index) => {
            const selected = answers[index];

            const correct = selected === question.correctAnswer;

            return (
              <div
                key={index}
                className="mb-8 border-b border-slate-100 pb-6 last:border-b-0"
              >
                <h3 className="mb-4 text-lg font-semibold text-slate-800">
                  {index + 1}. {question.question}
                </h3>

                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => {
                    const letter = String.fromCharCode(65 + optionIndex);

                    let optionStyle =
                      "border-slate-200 hover:border-indigo-300";

                    if (submitted && option === question.correctAnswer) {
                      optionStyle =
                        "border-green-500 bg-green-50 text-green-800";
                    } else if (submitted && option === selected) {
                      optionStyle =
                        "border-red-500 bg-red-50 text-red-800";
                    } else if (selected === option) {
                      optionStyle =
                        "border-indigo-500 bg-indigo-50";
                    }

                    return (
                      <label
                        key={`${index}-${optionIndex}`}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${optionStyle}`}
                      >
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option}
                          checked={selected === option}
                          disabled={submitted}
                          onChange={() =>
                            selectAnswer(index, option)
                          }
                          className="mt-1"
                        />

                        <span className="font-semibold">
                          {letter}.
                        </span>

                        <span>{option}</span>
                      </label>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="mt-4 rounded-xl bg-slate-50 p-4">
                    <p
                      className={`font-semibold ${
                        correct ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {correct ? "✓ Correct" : "✕ Incorrect"}
                    </p>

                    {!correct && (
                      <p className="mt-2 text-sm text-slate-700">
                        Correct answer: {question.correctAnswer}
                      </p>
                    )}

                    {question.explanation && (
                      <p className="mt-3 text-sm text-slate-600">
                        <strong>Explanation:</strong>{" "}
                        {question.explanation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {!submitted && (
            <button
              onClick={checkAnswers}
              disabled={saving}
              className="rounded-xl bg-green-600 px-6 py-3 font-medium text-white disabled:opacity-60"
            >
              Submit Quiz
            </button>
          )}

          {submitted && (
            <div className="mt-6">
              <div className="mb-4 rounded-2xl bg-indigo-50 p-5">
                <h2 className="text-2xl font-bold text-indigo-700">
                  Score: {score}/{quiz.length}
                </h2>

                <p className="mt-1 text-slate-600">
                  {Math.round((score / quiz.length) * 100)}% correct
                </p>
              </div>

              {saving && (
                <p className="mb-4 text-sm text-indigo-600">
                  Saving your quiz result...
                </p>
              )}

              {saved && (
                <p className="mb-4 text-sm font-medium text-green-700">
                  ✓ Quiz result saved successfully.
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={tryAgain}
                  className="rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white"
                >
                  Try Again
                </button>

                <button
                  onClick={generateQuiz}
                  disabled={generating}
                  className="rounded-xl bg-violet-600 px-6 py-3 font-medium text-white disabled:opacity-60"
                >
                  {generating ? "Generating..." : "Generate New Quiz"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AIQuiz;