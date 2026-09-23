const express = require("express");

const router = express.Router();


const protect = require("../middleware/authMiddleware");


const {
    getSubjects,
    createSubject,
    updateSubject,
    deleteSubject
} = require("../controllers/subjectController");



// Get all subjects

router.get(
    "/",
    protect,
    getSubjects
);



// Create subject

router.post(
    "/",
    protect,
    createSubject
);



// Update subject

router.put(
    "/:id",
    protect,
    updateSubject
);



// Delete subject

router.delete(
    "/:id",
    protect,
    deleteSubject
);



module.exports = router;