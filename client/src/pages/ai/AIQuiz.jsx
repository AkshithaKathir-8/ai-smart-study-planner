import { useState } from "react";
import { generateQuiz as generateQuizAPI } from "../../services/aiService";

function AIQuiz() {

  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");

  const [quiz, setQuiz] = useState([]);

  const [score, setScore] = useState(null);

  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});

  const generateQuiz = async () => {

  if (!subject.trim()) {
    alert("Please enter a subject");
    return;
  }
  
setAnswers({});
  try {

    setQuiz([]);
    setSubmitted(false);
    setScore(null);

    const response = await generateQuizAPI({

      subject,
      topic,
      difficulty: "Medium",
      count: 5,

    });

    const formattedQuiz = response.quiz.map((q) => ({

      question: q.question,

      options: q.options,

      correctAnswer: q.answer,

      explanation: q.explanation,

    }));

    setQuiz(formattedQuiz);

  }

  catch (err) {

    console.log(err);

    alert("Failed to generate quiz");

  }

};

  const checkAnswers = () => {

    let marks = 0;

    quiz.forEach((q, index) => {

      const selected = answers[index];

if (selected === q.correctAnswer) {
    marks++;
}

    });

    setScore(marks);

    setSubmitted(true);

  };

  const tryAgain = () => {

    setScore(null);

    setSubmitted(false);

setAnswers({});
  };

  return (

    <div className="p-8">

      <h1 className="text-3xl font-bold text-indigo-600 mb-6">
        🧠 AI Quiz Generator
      </h1>

      <div className="bg-white rounded-3xl shadow p-6 mb-6">

        <input
          className="border p-3 rounded-xl w-full mb-4"
          placeholder="Enter Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <input
          className="border p-3 rounded-xl w-full mb-4"
          placeholder="Enter Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <button
          onClick={generateQuiz}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-xl"
        >
          Generate Quiz
        </button>

      </div>

      {quiz.length > 0 && (

        <div className="bg-white rounded-3xl shadow p-6">

          {quiz.map((q, index) => {

            const selected = answers[index];

            return (

              <div
                key={index}
                className="mb-8"
              >

                <h3 className="font-semibold text-lg mb-3">

                  {index + 1}. {q.question}

                </h3>

                {q.options.map((option, optionIndex) => {
                 const optionLetter = String.fromCharCode(65 + optionIndex);
                  let bg = "";

                  if (submitted) {

                    if (option === q.correctAnswer){

                      bg = "bg-green-100 border-green-500";

                    }

                    else if (option === selected) {

                      bg = "bg-red-100 border-red-500";

                    }

                  }

                  return (

                    <label
  key={option}
  className={`block mb-2 border rounded-xl p-3 ${bg}`}
>

  <input
type="radio"
name={`q${index}`}
value={option}
checked={answers[index] === option}
disabled={submitted}
onChange={() =>
setAnswers({
...answers,
[index]: option
})
}
/>

  <span className="ml-2 font-medium">
    Option {optionLetter}
  </span>

  <span className="ml-2">
    {option}
  </span>

</label>

                  );

                })}

                {submitted && (() => {

  const correctIndex = q.options.findIndex(
    opt => opt === q.correctAnswer
  );

  const correctLetter =
    String.fromCharCode(65 + correctIndex);

  const isCorrect =
    selected === q.correctAnswer;

  return (

    <div className="mt-4 p-4 rounded-xl bg-slate-100">

      <p
        className={`font-bold text-lg ${
          isCorrect
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {isCorrect
          ? "✅ Correct"
          : "❌ Incorrect"}
      </p>

      {!isCorrect && (

<p className="mt-3 font-semibold">

  ✅ Correct Answer:

  <span className="text-green-700 ml-2">

    Option {correctLetter} — {q.correctAnswer}

  </span>

</p>

)}

      <p className="mt-3 text-sm text-slate-600">

        💡 Explanation:

        <br />

        {q.explanation}

      </p>

    </div>

  );

})()}
</div>
            );

          })}

          {!submitted && (

            <button
              onClick={checkAnswers}
              className="bg-green-600 text-white px-6 py-3 rounded-xl"
            >
              Submit Quiz
            </button>

          )}

          {submitted && (

            <div className="mt-6">

              <div className="p-5 rounded-2xl bg-green-50 mb-5">

                <h2 className="text-2xl font-bold text-green-700">

                  🎯 Score : {score}/{quiz.length}

                </h2>

              </div>

              <div className="flex gap-4">

                <button
                  onClick={tryAgain}
                  className="px-6 py-3 rounded-xl bg-indigo-600 text-white"
                >
                  🔄 Try Again
                </button>

                <button
                  onClick={generateQuiz}
                  className="px-6 py-3 rounded-xl bg-purple-600 text-white"
                >
                  ✨ Generate New Quiz
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