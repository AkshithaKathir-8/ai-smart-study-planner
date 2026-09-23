const Event = require("../models/Event");

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({
      userId: req.user.id,
    }).sort({ date: 1 });

    res.json(events);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Create event
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      req.body,
      {
        new: true,
      }
    );

    res.json(event);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    res.json({
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};