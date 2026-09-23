import {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";

import { useSubjects } from "./SubjectContext";
import { usePlanner } from "./PlannerContext";
import { useCalendar } from "./CalendarContext";
import { useNotes } from "./NotesContext";
import { useAttendance } from "./AttendanceContext";

import {
  askAI,
  getChatSessions,
  getConversationMessages
} from "../services/aiService";

const AIContext = createContext();


// =====================================================
// AI PROVIDER
// =====================================================

export function AIProvider({ children }) {

  // ===================================================
  // WORKSPACE DATA
  // ===================================================

  const { subjects } = useSubjects();
  const { sessions } = usePlanner();
  const { events } = useCalendar();
  const { notes } = useNotes();
  const { records } = useAttendance();


  // ===================================================
  // CHAT STATE
  // ===================================================

  const [messages, setMessages] = useState([]);

  const [isTyping, setIsTyping] = useState(false);

  const [chatSessions, setChatSessions] = useState([]);

  const [activeConversationId, setActiveConversationId] =
    useState(null);

  const [sessionsLoading, setSessionsLoading] =
    useState(true);

  const [messagesLoading, setMessagesLoading] =
    useState(false);


  // ===================================================
  // DEFAULT AI MESSAGE
  // ===================================================

  const welcomeMessage = {
    id: "welcome",
    sender: "ai",
    text:
      "👋 Hello Akshitha!\n\nI'm Kortex AI.\n\nI can help you with your study plans, subjects, tasks, notes and progress.\n\nAsk me anything!"
  };


  // ===================================================
  // LOAD CHAT SESSIONS
  // ===================================================

  const loadChatSessions = async () => {

    try {

      setSessionsLoading(true);

      const sessions =
        await getChatSessions();

      const validSessions =
        Array.isArray(sessions)
          ? sessions.filter(Boolean)
          : [];

      setChatSessions(validSessions);

    }

    catch (error) {

      console.log(
        "LOAD CHAT SESSIONS ERROR:",
        error.response?.data ||
        error.message
      );

      setChatSessions([]);

    }

    finally {

      setSessionsLoading(false);

    }

  };


  // ===================================================
  // LOAD SESSIONS WHEN PROVIDER STARTS
  // ===================================================

  useEffect(() => {

    loadChatSessions();

  }, []);


  // ===================================================
  // OPEN EXISTING CONVERSATION
  // ===================================================

  const openConversation = async (
    conversationId
  ) => {

    if (!conversationId) {
      return;
    }

    try {

      setMessagesLoading(true);

      const conversationMessages =
        await getConversationMessages(
          conversationId
        );

      const formattedMessages =
        Array.isArray(conversationMessages)

          ? conversationMessages.map(
              (item, index) => ({

                id:
                  item._id ||
                  `${conversationId}-${index}`,

                sender:
                  item.role === "user"
                    ? "user"
                    : "ai",

                text:
                  item.message || ""

              })
            )

          : [];


      setActiveConversationId(
        conversationId
      );


      setMessages(
        formattedMessages.length > 0
          ? formattedMessages
          : [welcomeMessage]
      );

    }

    catch (error) {

      console.log(
        "OPEN CONVERSATION ERROR:",
        error.response?.data ||
        error.message
      );

      setMessages([
        welcomeMessage
      ]);

    }

    finally {

      setMessagesLoading(false);

    }

  };


  // ===================================================
  // START NEW CHAT
  // ===================================================
  //
  // IMPORTANT:
  //
  // This DOES NOT create a MongoDB ChatSession.
  //
  // A session will only be created by the backend
  // after the user actually sends the first message.
  //
  // ===================================================

  const startNewChat = () => {

    setActiveConversationId(null);

    setMessages([
      {
        ...welcomeMessage,
        id:
          `welcome-${Date.now()}`
      }
    ]);

  };


  // ===================================================
  // SEND MESSAGE
  // ===================================================

  const sendMessage = async (
    text
  ) => {

    if (
      !text ||
      !text.trim() ||
      isTyping
    ) {

      return;

    }


    const userMessage =
      text.trim();


    // =================================================
    // SHOW USER MESSAGE IMMEDIATELY
    // =================================================

    const temporaryUserMessage = {

      id:
        `user-${Date.now()}`,

      sender:
        "user",

      text:
        userMessage

    };


    setMessages((prev) => [

      ...prev,

      temporaryUserMessage

    ]);


    setIsTyping(true);


    try {

      // =================================================
      // BUILD CURRENT WORKSPACE
      // =================================================

      const workspace = {

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
          Array.isArray(records)

            ? records.map(
                (record) => ({

                  subject:
                    record.subjectId?.name ||
                    record.subjectId?.subject ||
                    record.subject ||
                    "Unknown",

                  attended:
                    record.attended ?? 0,

                  total:
                    record.total ?? 0,

                  percentage:
                    record.total > 0

                      ? Math.round(
                          (
                            record.attended /
                            record.total
                          ) * 100
                        )

                      : 0

                })
              )

            : []

      };


      console.log(
        "CURRENT AI WORKSPACE:",
        workspace
      );


      // =================================================
      // SEND TO BACKEND
      // =================================================

      const response =
        await askAI({

          message:
            userMessage,

          conversationId:
            activeConversationId,

          context:
            workspace

        });


      // =================================================
      // GET RESPONSE
      // =================================================

      const reply =
        response?.reply ||
        response?.message ||
        "Sorry, I couldn't generate a response.";


      // =================================================
      // IMPORTANT:
      //
      // When this is the FIRST message in a new chat,
      // the backend creates the ChatSession and returns
      // its ID.
      //
      // =================================================

      if (
        response?.conversationId
      ) {

        setActiveConversationId(
          response.conversationId
        );

      }


      // =================================================
      // ADD AI RESPONSE
      // =================================================

      setMessages((prev) => [

        ...prev,

        {

          id:
            `ai-${Date.now()}`,

          sender:
            "ai",

          text:
            reply

        }

      ]);


      // =================================================
      // REFRESH SIDEBAR SESSIONS
      //
      // This happens AFTER the first real message.
      //
      // Therefore "New Chat" is not added to MongoDB
      // just by clicking + New Chat.
      //
      // =================================================

      const updatedSessions =
        await getChatSessions();


      if (
        Array.isArray(updatedSessions)
      ) {

        setChatSessions(
          updatedSessions
        );

      }

    }

    catch (error) {

      console.log(
        "AI CHAT ERROR:",
        error.response?.data ||
        error.message
      );


      setMessages((prev) => [

        ...prev,

        {

          id:
            `error-${Date.now()}`,

          sender:
            "ai",

          text:
            error.response?.data?.message ||
            "⚠️ AI service is temporarily unavailable."

        }

      ]);

    }

    finally {

      setIsTyping(false);

    }

  };


  // ===================================================
  // CLEAR CURRENT CHAT
  // ===================================================

  const clearChat = () => {

    setMessages([]);

    setActiveConversationId(null);

  };


  // ===================================================
  // REFRESH CHAT SESSIONS
  // ===================================================

  const refreshChatSessions = async () => {

    await loadChatSessions();

  };


  // ===================================================
  // CONTEXT VALUE
  // ===================================================

  return (

    <AIContext.Provider
      value={{

        // Messages
        messages,

        setMessages,

        // Chat actions
        sendMessage,

        startNewChat,

        openConversation,

        clearChat,

        // Conversation information
        activeConversationId,

        setActiveConversationId,

        // Sidebar conversations
        chatSessions,

        setChatSessions,

        refreshChatSessions,

        // Loading states
        isTyping,

        sessionsLoading,

        messagesLoading

      }}
    >

      {children}

    </AIContext.Provider>

  );

}


// =====================================================
// USE AI
// =====================================================

export function useAI() {

  return useContext(
    AIContext
  );

}