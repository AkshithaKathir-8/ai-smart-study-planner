const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  togglePin,
  uploadNoteFile,
  generateNoteSummary,
  generateTwoMarkQuestions,
  generateNoteQuiz,

} = require("../controllers/noteController");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  const allowed = [".pdf", ".docx", ".txt"];

  if (allowed.includes(extension)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF, DOCX, and TXT files are supported."
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.use(auth);

router.get("/", getNotes);
router.post("/", createNote);
router.put(
  "/:id",
  upload.single("file"),
  updateNote
);
router.delete("/:id", deleteNote);
router.patch("/:id/pin", togglePin);

router.post(
  "/upload",
  upload.single("file"),
  uploadNoteFile
);

router.post(
  "/:id/ai-summary",
  generateNoteSummary
);

router.post(
  "/:id/two-mark-questions",
  generateTwoMarkQuestions
);

router.post(
  "/:id/generate-quiz",
  generateNoteQuiz
);
module.exports = router;