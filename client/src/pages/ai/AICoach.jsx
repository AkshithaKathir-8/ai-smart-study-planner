import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import { useSubjects } from "../../context/SubjectContext";
import { usePlanner } from "../../context/PlannerContext";
import { useCalendar } from "../../context/CalendarContext";
import { useNotes } from "../../context/NotesContext";
import { useAttendance } from "../../context/AttendanceContext";

import {
  Sparkles,
  Send,
  Brain,
  Calendar,
  Target,
  Clock,
  MessageSquare,
  Plus,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

import { motion } from "framer-motion";

import MainLayout from "../../components/layout/MainLayout";

import {
  generateStudyPlan,
  getAIPlans,
  markPlanSessionCompleted,
  askAI,
  getChatSessions,
  getConversationMessages
} from "../../services/aiService";


function AICoach() {

  // =====================================================
  // WORKSPACE DATA
  // =====================================================

  const { subjects } = useSubjects();
  const { sessions } = usePlanner();
  const { events } = useCalendar();
  const { notes } = useNotes();
  const { records } = useAttendance();


  // =====================================================
  // STATE
  // =====================================================

  const [loading, setLoading] = useState(false);

  const [plan, setPlan] = useState(null);

  const [message, setMessage] = useState("");

  const [isTyping, setIsTyping] = useState(false);

  const [chat, setChat] = useState([]);
  
  const [completingSessionId, setCompletingSessionId] = useState(null);

  const [chatSessions, setChatSessions] = useState([]);

  const [activeConversationId, setActiveConversationId] =
    useState(null);

  const [sessionsLoading, setSessionsLoading] =
    useState(true);

  const [historyLoading, setHistoryLoading] =
    useState(false);


  // =====================================================
  // AUTO SCROLL
  // =====================================================

  const chatBottomRef = useRef(null);

  useEffect(() => {

    chatBottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  }, [chat, isTyping]);

  // =====================================================
// LOAD THE LATEST SAVED AI STUDY PLAN
// =====================================================

useEffect(() => {
  let mounted = true;

  const loadLatestAIPlan = async () => {
    try {
      const response = await getAIPlans();

      if (!mounted) return;

      // Support either an array response or an object containing plans.
      const plans = Array.isArray(response)
        ? response
        : Array.isArray(response?.plans)
        ? response.plans
        : [];

      setPlan(plans.length > 0 ? plans[0] : null);
    } catch (error) {
      console.log(
        "AI Coach plan loading error:",
        error.response?.data || error.message
      );
    }
  };

  loadLatestAIPlan();

  return () => {
    mounted = false;
  };
}, []);


  // =====================================================
  // LOAD REAL CHAT SESSIONS
  // =====================================================

  useEffect(() => {

    let mounted = true;

    const loadChatSessions = async () => {

      try {

        setSessionsLoading(true);

        const response =
          await getChatSessions();

        const validSessions =
          Array.isArray(response)
            ? response
            : [];

        if (!mounted) {
          return;
        }

        setChatSessions(validSessions);

 

        // -------------------------------------------------
        // Open latest REAL conversation automatically
        // -------------------------------------------------

        if (
          validSessions.length > 0 &&
          !activeConversationId
        ) {

          const latestSession =
            validSessions[0];

          await handleOpenChat(
            latestSession._id
          );

        }

      }

      catch (error) {

        console.log(
          "CHAT SESSIONS ERROR:",
          error.response?.data ||
          error.message
        );

      }

      finally {

        if (mounted) {
          setSessionsLoading(false);
        }

      }

    };


    loadChatSessions();


    return () => {
      mounted = false;
    };

  }, []);


  // =====================================================
  // NEW CHAT
  // =====================================================

  const handleNewChat = () => {

    /*
      IMPORTANT:

      Do NOT create a database conversation here.

      A conversation will be created by the backend
      only when the user actually sends the first message.
    */

    setActiveConversationId(null);

    setChat([
      {
        sender: "ai",
        text: "👋 Hi! I'm Kortex AI. How can I help you?"
      }
    ]);

    setMessage("");

  };


  // =====================================================
  // OPEN EXISTING CHAT
  // =====================================================

  const handleOpenChat = async (conversationId) => {

    if (!conversationId) {
      return;
    }


    try {

      setHistoryLoading(true);


      const response =
        await getConversationMessages(
          conversationId
        );


      setActiveConversationId(
        conversationId
      );


      const formatted =
        Array.isArray(response)

          ? response.map((item) => ({

              sender:
                item.role === "user"
                  ? "user"
                  : "ai",

              text:
                item.message || ""

            }))

          : [];


      setChat(formatted);

      setMessage("");

    }

    catch (error) {

      console.log(
        "OPEN CHAT ERROR:",
        error.response?.data ||
        error.message
      );

    }

    finally {

      setHistoryLoading(false);

    }

  };

// =====================================================
// MARK A STUDY SESSION AS COMPLETED
// =====================================================

const handleMarkCompleted = async (session) => {
  if (!plan?._id || !session?._id || session.completed) {
    return;
  }

  try {
    setCompletingSessionId(session._id);

    const response = await markPlanSessionCompleted(
      plan._id,
      session._id
    );

    if (response?.plan) {
      setPlan(response.plan);

      // Refresh the Study Streak shown in the sidebar.
      window.dispatchEvent(
        new Event("ai-study-plan-updated")
      );
    }
    } catch (error) {
    console.error(
      "MARK SESSION COMPLETED ERROR:",
      error.response?.data || error.message
    );

    alert(
      error.response?.data?.message ||
      "Unable to save completion. Please try again."
    );
  } finally {
    setCompletingSessionId(null);
  }
};
  // =====================================================
  // GENERATE AI STUDY PLAN
  // =====================================================

  

  const handleGenerate = async () => {

    try {

      setLoading(true);


      const formattedSubjects =
        Array.isArray(subjects)

          ? subjects
              .map((subject) =>
                typeof subject === "string"
                  ? subject
                  : subject?.name
              )
              .filter(Boolean)

          : [];


      if (
        formattedSubjects.length === 0
      ) {

        alert(
          "Please add subjects first."
        );

        return;

      }


      const response =
        await generateStudyPlan({

          goal:
            "Prepare for upcoming exams",

          subjects:
            formattedSubjects,

          days:
            7

        });



const generatedPlan = response?.plan || null;

setPlan(generatedPlan);

// Tell other pages to reload the latest saved plan.
if (generatedPlan) {
  window.dispatchEvent(
    new Event("ai-study-plan-updated")
  );
}

    }

    catch (error) {

      console.log(
        "AI PLAN ERROR:",
        error.response?.data ||
        error.message
      );


      alert(

        error.response?.data?.message ||

        "Failed to generate AI study plan"

      );

    }

    finally {

      setLoading(false);

    }

  };


  // =====================================================
  // CHAT WITH KORTEX AI
  // =====================================================

  const handleChat = async () => {

    if (
      !message.trim() ||
      isTyping
    ) {

      return;

    }


    const userMessage =
      message.trim();


    // ---------------------------------------------------
    // SHOW USER MESSAGE
    // ---------------------------------------------------

    setChat((prev) => [

      ...prev,

      {
        sender: "user",
        text: userMessage
      }

    ]);


    setMessage("");

    setIsTyping(true);


    try {

      // =================================================
      // ATTENDANCE DATA
      // =================================================

      const attendanceRecords =
        Array.isArray(records)

          ? records.map((record) => {

              const attended =
                Number(
                  record?.attended ?? 0
                );

              const total =
                Number(
                  record?.total ?? 0
                );

              const percentage =
                total > 0
                  ? Number(
                      (
                        (attended / total) *
                        100
                      ).toFixed(2)
                    )
                  : null;


              return {

                subject:
                  record?.subjectId?.name ||

                  record?.subjectId?.subject ||

                  record?.subject?.name ||

                  record?.subject?.subject ||

                  record?.subject ||

                  "Unknown",

                attended,

                total,

                percentage

              };

            })

          : [];


      // =================================================
      // CURRENT WORKSPACE
      // =================================================

      const context = {

        subjects:
          Array.isArray(subjects)
            ? subjects
            : [],

        sessions:
          Array.isArray(sessions)
            ? sessions
            : [],

        events:
          Array.isArray(events)
            ? events
            : [],

        notes:
          Array.isArray(notes)
            ? notes
            : [],

        records:
          attendanceRecords

      };


      console.log(
        "KORTEX CURRENT WORKSPACE:",
        context
      );


      // =================================================
      // ASK BACKEND
      // =================================================

      /*
        IMPORTANT:

        We do NOT create a chat session here.

        If activeConversationId exists,
        continue that conversation.

        If it does not exist,
        backend creates exactly ONE conversation
        for this first message.
      */

      const response =
        await askAI({

          message:
            userMessage,

          conversationId:
            activeConversationId || undefined,

          context

        });


      console.log(
        "KORTEX AI RESPONSE:",
        response
      );


      // =================================================
      // SET ACTIVE CONVERSATION
      // =================================================

      if (
        response?.conversationId
      ) {

        setActiveConversationId(
          response.conversationId
        );

      }


      // =================================================
      // AI RESPONSE
      // =================================================

      setChat((prev) => [

        ...prev,

        {

          sender: "ai",

          text:
            response?.reply ||

            "Sorry, I could not generate a response."

        }

      ]);


      // =================================================
      // REFRESH SIDEBAR
      // =================================================

      try {

        const updatedSessions =
          await getChatSessions();


        const validSessions =
          Array.isArray(
            updatedSessions
          )
            ? updatedSessions
            : [];


        setChatSessions(
          validSessions
        );

      }

      catch (sessionError) {

        console.log(
          "SESSION REFRESH ERROR:",
          sessionError
        );

      }

    }

    catch (error) {

      console.log(
        "CHAT ERROR:",
        error.response?.data ||
        error.message
      );


      setChat((prev) => [

        ...prev,

        {

          sender: "ai",

          text:

            error.response?.data?.message ||

            "Sorry, I am unable to respond right now."

        }

      ]);

    }

    finally {

      setIsTyping(false);

    }

  };


  // =====================================================
  // ENTER KEY
  // =====================================================

  const handleKeyDown = (e) => {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault();

      handleChat();

    }

  };


  // =====================================================
  // RETURN
  // =====================================================

  return (

    <MainLayout>

      <div className="space-y-10">


        {/* =================================================
            HERO
        ================================================= */}

        <motion.div

          initial={{
            opacity: 0,
            y: 20
          }}

          animate={{
            opacity: 1,
            y: 0
          }}

          className="
            rounded-[2.5rem]
            p-10
            text-white
            bg-gradient-to-br
            from-indigo-600
            via-purple-600
            to-fuchsia-600
            shadow-2xl
          "

        >

          <div className="flex items-center gap-3">

            <div
              className="
                bg-white/20
                p-3
                rounded-2xl
              "
            >

              <Sparkles size={32} />

            </div>


            <h2 className="
              text-xl
              font-semibold
            ">

              Kortex AI Coach

            </h2>

          </div>


          <h1 className="
            text-5xl
            font-bold
            mt-6
          ">

            Your Personal Study Intelligence

          </h1>


          <p className="
            text-indigo-100
            text-lg
            mt-4
          ">

            AI powered planning, smart recommendations
            and personalized learning strategies.

          </p>


          <button

            onClick={handleGenerate}

            disabled={loading}

            className="
              mt-8
              bg-white
              text-indigo-700
              px-8
              py-4
              rounded-2xl
              font-bold
              hover:scale-105
              transition
              disabled:opacity-60
              disabled:hover:scale-100
            "

          >

            {

              loading

                ? "Generating..."

                : "Generate New Plan ✨"

            }

          </button>

        </motion.div>


        {/* =================================================
            FEATURES
        ================================================= */}

        <div className="
          grid
          md:grid-cols-3
          gap-6
        ">

          <FeatureCard
            icon={<Brain />}
            title="Smart Analysis"
            text="AI understands your subjects."
          />


          <FeatureCard
            icon={<Calendar />}
            title="Smart Scheduling"
            text="Creates optimized study plans."
          />


          <FeatureCard
            icon={<Target />}
            title="Goal Tracking"
            text="Helps you achieve targets."
          />

        </div>


        {/* =================================================
            AI STUDY PLAN
        ================================================= */}

        {

          plan && (

            <div className="
              bg-white
              rounded-3xl
              shadow-xl
              border
              p-8
            ">

              <h2 className="
                text-3xl
                font-bold
              ">

                🤖 AI Generated Study Plan

              </h2>


              <div className="
                mt-6
                space-y-5
              ">

                {

                  plan.sessions?.map(
                    (session, index) => (

                      <div

                        key={
                          session._id ||
                          index
                        }

                        className="
                          bg-indigo-50
                          rounded-2xl
                          p-5
                          border
                        "
                      >

                        <div className="
                          flex
                          justify-between
                          gap-4
                          flex-wrap
                        ">

                          <h3 className="
                            font-bold
                            text-xl
                          ">

                            Day {session.day}

                            {" • "}

                            {session.subject}

                          </h3>


                          <span className="
                            bg-purple-100
                            text-purple-700
                            px-3
                            py-1
                            rounded-full
                          ">

                            {session.priority}

                          </span>

                        </div>


                        <p className="mt-3">

                          {session.topic}

                        </p>


                        <div className="
                          flex
                          gap-5
                          mt-3
                          text-indigo-600
                          flex-wrap
                        ">

                          <span className="
                            flex
                            gap-2
                            items-center
                          ">

                            <Clock size={16} />

                            {session.duration}

                          </span>


                          <span>

                            ⏰ {session.time}

                          </span>

                        </div>


                        <p className="
                          mt-3
                          italic
                          text-slate-500
                        ">

                          💡{" "}

                          {
                            session.tips ||
                            "Revise this topic"
                          }

                        </p>
                        <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
  {session.completed ? (
    <span className="inline-flex items-center gap-2 rounded-xl bg-green-100 px-4 py-2 font-semibold text-green-700">
      <CheckCircle2 size={18} />
      Completed
    </span>
  ) : (
    <button
  type="button"
  onClick={() => handleMarkCompleted(session)}
  disabled={completingSessionId === session._id}
  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
>
  <CheckCircle2 size={18} />
  {completingSessionId === session._id ? "Saving..." : "Mark as Completed"}
</button>
  )}

  {session.completedAt && (
    <span className="text-sm text-slate-500">
      Saved as completed
    </span>
  )}
</div>

                      </div>

                    )

                  )

                }

              </div>

            </div>

          )

        }


        {/* =================================================
            KORTEX AI CHAT
        ================================================= */}

        <div className="
          bg-white
          rounded-3xl
          shadow-xl
          border
          overflow-hidden
        ">


          {/* =================================================
              CHAT HEADER
          ================================================= */}

          <div className="
            p-6
            border-b
            flex
            items-center
            justify-between
            gap-4
            flex-wrap
          ">

            <div>

              <h2 className="
                text-xl
                font-bold
              ">

                🤖 Ask Kortex AI

              </h2>

              <p className="
                text-sm
                text-slate-500
                mt-1
              ">

                Your AI study assistant remembers your conversations.

              </p>

            </div>


            <button

              onClick={handleNewChat}

              className="
                flex
                items-center
                gap-2
                bg-indigo-600
                text-white
                px-5
                py-3
                rounded-2xl
                font-semibold
                hover:bg-indigo-700
                transition
              "

            >

              <Plus size={18} />

              New Chat

            </button>

          </div>


          {/* =================================================
              CHAT BODY
          ================================================= */}

          <div className="
            grid
            lg:grid-cols-[260px_1fr]
            min-h-[500px]
          ">


            {/* =================================================
                CONVERSATION SIDEBAR
            ================================================= */}

            <div className="
              border-r
              bg-slate-50
              p-4
            ">

              <div className="
                flex
                items-center
                gap-2
                px-2
                mb-4
              ">

                <MessageSquare
                  size={18}
                  className="text-indigo-600"
                />

                <h3 className="
                  font-semibold
                  text-slate-700
                ">

                  Conversations

                </h3>

              </div>


              {

                sessionsLoading ? (

                  <div className="
                    text-sm
                    text-slate-500
                    px-2
                    py-4
                  ">

                    Loading chats...

                  </div>

                ) : chatSessions.length === 0 ? (

                  <div className="
                    text-sm
                    text-slate-500
                    px-2
                    py-4
                  ">

                    No previous chats yet.

                  </div>

                ) : (

                  <div className="
                    space-y-2
                    max-h-[450px]
                    overflow-y-auto
                  ">

                    {

                      chatSessions.map(
                        (session) => (

                          <button

                            key={
                              session._id
                            }

                            onClick={() =>
                              handleOpenChat(
                                session._id
                              )
                            }

                            className={`

                              w-full

                              text-left

                              p-3

                              rounded-xl

                              transition

                              flex

                              items-center

                              gap-2

                              ${
                                activeConversationId ===
                                session._id

                                  ? "bg-indigo-100 text-indigo-700"

                                  : "hover:bg-white text-slate-700"
                              }

                            `}

                          >

                            <MessageSquare
                              size={16}
                              className="shrink-0"
                            />


                            <span className="
                              flex-1
                              truncate
                              text-sm
                              font-medium
                            ">

                              {
  session.title || "New Chat"
}

                            </span>


                            <ChevronRight
                              size={15}
                              className="shrink-0"
                            />

                          </button>

                        )

                      )

                    }

                  </div>

                )

              }

            </div>


            {/* =================================================
                CHAT AREA
            ================================================= */}

            <div className="
              p-6
              flex
              flex-col
              min-w-0
            ">


              {/* =================================================
                  MESSAGES
              ================================================= */}

              <div className="
                space-y-4
                flex-1
                max-h-[450px]
                overflow-y-auto
                pr-2
              ">


                {

                  historyLoading ? (

                    <div className="
                      bg-slate-100
                      p-4
                      rounded-2xl
                      max-w-xl
                      text-slate-500
                    ">

                      Loading conversation...

                    </div>

                  ) : chat.length === 0 ? (

                    <div className="
                      flex
                      flex-col
                      items-center
                      justify-center
                      min-h-[300px]
                      text-center
                      text-slate-500
                    ">

                      <MessageSquare
                        size={42}
                        className="
                          text-indigo-300
                          mb-4
                        "
                      />

                      <p className="font-medium">

                        Start a new conversation

                      </p>

                      <p className="
                        text-sm
                        mt-1
                      ">

                        Ask Kortex AI anything about your studies.

                      </p>

                    </div>

                  ) : (

                    chat.map(
                      (item, index) => (

                        <div

                          key={index}

                          className={`

                            p-4

                            rounded-2xl

                            max-w-xl

                            break-words

                            ${
                              item.sender === "user"

                                ? "ml-auto bg-indigo-600 text-white"

                                : "bg-slate-100 text-slate-700"
                            }

                          `}

                        >

                          <ReactMarkdown>

                            {

                              typeof item.text ===
                              "string"

                                ? item.text

                                : JSON.stringify(
                                    item.text,
                                    null,
                                    2
                                  )

                            }

                          </ReactMarkdown>

                        </div>

                      )

                    )

                  )

                }


                {/* =================================================
                    TYPING INDICATOR
                ================================================= */}

                {

                  isTyping && (

                    <div className="
                      bg-slate-100
                      p-4
                      rounded-2xl
                      max-w-xl
                      text-slate-600
                      flex
                      items-center
                      gap-2
                    ">

                      <span>
                        🤖 Kortex AI is thinking
                      </span>

                      <div className="
                        flex
                        gap-1
                      ">

                        <span className="animate-bounce">
                          ●
                        </span>

                        <span className="animate-bounce">
                          ●
                        </span>

                        <span className="animate-bounce">
                          ●
                        </span>

                      </div>

                    </div>

                  )

                }


                <div ref={chatBottomRef} />

              </div>


              {/* =================================================
                  INPUT
              ================================================= */}

              <div className="
                flex
                gap-3
                mt-5
              ">

                <input

                  value={message}

                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }

                  onKeyDown={
                    handleKeyDown
                  }

                  disabled={
                    isTyping
                  }

                  placeholder="Ask your AI Coach..."

                  className="
                    flex-1
                    min-w-0
                    border
                    rounded-2xl
                    px-5
                    py-3
                    outline-none
                    focus:ring-2
                    focus:ring-indigo-500
                    disabled:bg-slate-100
                  "

                />


                <button

                  onClick={
                    handleChat
                  }

                  disabled={
                    !message.trim() ||
                    isTyping
                  }

                  className="
                    bg-indigo-600
                    text-white
                    px-5
                    rounded-2xl
                    hover:bg-indigo-700
                    transition
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    flex
                    items-center
                    justify-center
                  "

                >

                  <Send size={20} />

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </MainLayout>

  );

}


// =====================================================
// FEATURE CARD
// =====================================================

function FeatureCard({
  icon,
  title,
  text
}) {

  return (

    <motion.div

      whileHover={{
        y: -5
      }}

      className="
        bg-white
        rounded-3xl
        p-6
        shadow-xl
        border
      "

    >

      <div className="
        text-indigo-600
      ">

        {icon}

      </div>


      <h3 className="
        font-bold
        text-xl
        mt-4
      ">

        {title}

      </h3>


      <p className="
        text-slate-500
        mt-2
      ">

        {text}

      </p>

    </motion.div>

  );

}


export default AICoach;