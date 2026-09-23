import api from "./api";

// =====================================================
// AI STUDY PLAN
// =====================================================

export const generateStudyPlan = async (data) => {
  const response = await api.post(
    "/ai/generate",
    data
  );

  return response.data;
};

const getLocalDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// =====================================================
// GET PREVIOUS AI PLANS
// =====================================================

export const getAIPlans = async () => {
  const response = await api.get("/ai/plans", {
    params: {
      localDate: getLocalDate(),
    },
  });

  return response.data;
};

// =====================================================
// KORTEX AI CHAT
// =====================================================

export const askAI = async (data) => {
  const response = await api.post(
    "/ai/chat",
    data
  );

  return response.data;
};


// =====================================================
// CREATE CHAT SESSION
// =====================================================

export const createChatSession = async () => {
  const response = await api.post(
    "/ai/chat/new"
  );

  return response.data;
};


// =====================================================
// GET ALL CHAT SESSIONS
// =====================================================

export const getChatSessions = async () => {
  const response = await api.get(
    "/ai/chat-sessions"
  );

  return response.data;
};


// =====================================================
// GET ONE CONVERSATION
// =====================================================

export const getConversationMessages = async (
  conversationId
) => {
  const response = await api.get(
    `/ai/chat/${conversationId}`
  );

  return response.data;
};


// =====================================================
// OLD CHAT HISTORY
// =====================================================
// Kept because AIContext.jsx currently imports it.
// It returns the messages from the latest conversation.

export const getChatHistory = async () => {
  const sessions = await getChatSessions();

  if (
    !Array.isArray(sessions) ||
    sessions.length === 0
  ) {
    return [];
  }

  const latestSession = sessions[0];

  return getConversationMessages(
    latestSession._id
  );
};


// =====================================================
// GENERATE AI QUIZ
// =====================================================

export const generateQuiz = async (data) => {
  const response = await api.post(
    "/ai/quiz",
    data
  );

  return response.data;
};


export const markPlanSessionCompleted = async (planId, sessionId) => {
  const response = await api.post(
    `/ai/plans/${planId}/sessions/${sessionId}/complete`,
    {
      localDate: getLocalDate(),
    }
  );

  return response.data;
};