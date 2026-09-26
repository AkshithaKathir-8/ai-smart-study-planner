const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/userController");

// Get logged-in user's profile
router.get(
  "/profile",
  protect,
  getProfile
);

// Update logged-in user's profile
router.put(
  "/profile",
  protect,
  updateProfile
);

// Change logged-in user's password
router.put(
  "/change-password",
  protect,
  changePassword
);

module.exports = router;