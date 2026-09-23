const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
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


module.exports = router;