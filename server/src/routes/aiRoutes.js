const express = require("express");

const router = express.Router();

const {
  generatePlan,
  getPlans,
  chatAI,
  getChatSessions,
  createChatSession,
  getConversationMessages,
  generateQuiz,
  markPlanSessionCompleted,
} = require("../controllers/aiController");

const protect = require("../middleware/authMiddleware");

// =====================================================
// AI STUDY PLAN
// =====================================================

router.post(
  "/generate",
  protect,
  generatePlan
);

router.get(
  "/plans",
  protect,
  getPlans
);

router.post(
  "/plans/:planId/sessions/:sessionId/complete",
  protect,
  markPlanSessionCompleted
);

// =====================================================
// AI CHAT
// =====================================================

// Send message to AI
router.post(
  "/chat",
  protect,
  chatAI
);

// Create new conversation
router.post(
  "/chat/new",
  protect,
  createChatSession
);

// Get all conversations
router.get(
  "/chat-sessions",
  protect,
  getChatSessions
);

// Get messages of one conversation
router.get(
  "/chat/:conversationId",
  protect,
  getConversationMessages
);

// =====================================================
// AI QUIZ
// =====================================================

router.post(
  "/quiz",
  protect,
  generateQuiz
);

module.exports = router;