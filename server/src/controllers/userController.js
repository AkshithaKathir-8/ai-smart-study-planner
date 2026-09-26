const User = require("../models/User");

// GET USER PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// UPDATE USER PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, notificationsEnabled } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if another account already uses this email
    if (email && email.toLowerCase() !== user.email) {
      const existingUser = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Email is already in use",
        });
      }
    }

    if (name) {
      user.name = name.trim();
    }

    if (email) {
      user.email = email.toLowerCase().trim();
    }
     
    if (typeof notificationsEnabled === "boolean") {
  user.notificationsEnabled = notificationsEnabled;
}

    await user.save();

    res.json({
      message: "Profile updated successfully",
     user: {
  id: user._id,
  name: user.name,
  email: user.email,
  notificationsEnabled: user.notificationsEnabled,
},
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};