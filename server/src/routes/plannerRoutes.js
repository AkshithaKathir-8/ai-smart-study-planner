const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createSession,
    getSessions,
    updateSession,
    deleteSession,
    getSharedStreak

} = require("../controllers/plannerController");



// Create study session

router.post(
    "/",
    protect,
    createSession
);


router.get("/streak", protect, getSharedStreak);

// Get all sessions

router.get(
    "/",
    protect,
    getSessions
);



// Update session

router.put(
    "/:id",
    protect,
    updateSession
);



// Delete session

router.delete(
    "/:id",
    protect,
    deleteSession
);



module.exports = router;