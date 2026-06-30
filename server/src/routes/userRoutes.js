const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

// Protected route
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "User profile accessed successfully",
    user: req.user,
  });
});

module.exports = router;