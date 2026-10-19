const fs = require("fs");
const path = require("path");

const Note = require("../models/Note");
const Subject = require("../models/Subject");

const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");
const Groq = require("groq-sdk");
const { jsonrepair } = require("jsonrepair");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const AI_MODEL = "openai/gpt-oss-20b";
const cleanText = (value) =>
  String(value ?? "").trim();

// =====================================================
// GET NOTES
// =====================================================

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.user.id,
    }).sort({
      pinned: -1,
      updatedAt: -1,
    });

    res.json(notes);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


// =====================================================
// CREATE NORMAL TEXT NOTE
// =====================================================

exports.createNote = async (req, res) => {
  try {
    const note = await Note.create({
      userId: req.user.id,
      title: req.body.title,
      subject: req.body.subject,
      description: req.body.description,
      pinned: req.body.pinned,
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


// =====================================================
// UPDATE NOTE
// =====================================================

exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found.",
      });
    }

    const {
      title,
      subject,
      description,
      pinned,
    } = req.body;

    note.title = title ?? note.title;
    note.subject = subject ?? note.subject;

    note.description =
      description ?? note.description;

    if (pinned !== undefined) {
      note.pinned =
        pinned === "true" ||
        pinned === true;
    }

    // Replace uploaded study material if a new file is provided
    if (req.file) {
      const extension = path
        .extname(req.file.originalname)
        .toLowerCase();

      let extractedText = "";

      if (extension === ".pdf") {
        const parser = new PDFParse({
          data: req.file.buffer,
        });

        const pdfData =
          await parser.getText();

        extractedText =
          pdfData.text || "";

        await parser.destroy();
      } else if (extension === ".docx") {
        const result =
          await mammoth.extractRawText({
            buffer: req.file.buffer,
          });

        extractedText = result.value;
      } else if (extension === ".txt") {
        extractedText =
          req.file.buffer.toString("utf8");
      } else {
        return res.status(400).json({
          message:
            "Only PDF, DOCX, and TXT files are supported.",
        });
      }

      extractedText =
        extractedText.trim();

      if (!extractedText) {
        return res.status(400).json({
          message:
            "No readable text was found in this file.",
        });
      }

      const uploadsDirectory =
        path.join(
          __dirname,
          "../../uploads"
        );

      if (
        !fs.existsSync(
          uploadsDirectory
        )
      ) {
        fs.mkdirSync(
          uploadsDirectory,
          {
            recursive: true,
          }
        );
      }

      const originalExtension =
        path.extname(
          req.file.originalname
        );

      const safeName = path
        .basename(
          req.file.originalname,
          originalExtension
        )
        .replace(
          /[^a-zA-Z0-9-_]/g,
          "_"
        );

      const storedFileName =
        `${Date.now()}-${safeName}${originalExtension}`;

      const storedFilePath =
        path.join(
          uploadsDirectory,
          storedFileName
        );

      fs.writeFileSync(
        storedFilePath,
        req.file.buffer
      );

      note.fileName =
        req.file.originalname;

      note.filePath =
        path.join(
          "uploads",
          storedFileName
        );

      note.fileType =
        extension;

      note.extractedText =
        extractedText;

      // Clear AI results belonging to the previous file
      note.aiSummary = "";
      note.twoMarkQuestions = [];
    }

    await note.save();

    return res.status(200).json(note);
  } catch (error) {
    console.error(
      "UPDATE NOTE ERROR:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to update note.",
    });
  }
};


// =====================================================
// DELETE NOTE
// =====================================================

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (note?.filePath) {
      const fullPath = path.join(
        __dirname,
        "../../",
        note.filePath
      );

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    res.json({
      message: "Deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


// =====================================================
// TOGGLE PIN
// =====================================================

exports.togglePin = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    note.pinned = !note.pinned;

    await note.save();

    res.json(note);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


// =====================================================
// UPLOAD STUDY MATERIAL
// =====================================================

exports.uploadNoteFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message:
          "Please upload a PDF, DOCX, or TXT file.",
      });
    }

    const {
      title,
      subject,
      description,
      pinned,
    } = req.body;

    if (!title || !subject) {
      return res.status(400).json({
        message:
          "Title and subject are required.",
      });
    }

    const extension = path
      .extname(req.file.originalname)
      .toLowerCase();

    let extractedText = "";

    if (extension === ".pdf") {
      const parser = new PDFParse({
        data: req.file.buffer,
      });

      const pdfData =
        await parser.getText();

      extractedText =
        pdfData.text || "";

      await parser.destroy();
    } else if (extension === ".docx") {
      const result =
        await mammoth.extractRawText({
          buffer: req.file.buffer,
        });

      extractedText = result.value;
    } else if (extension === ".txt") {
      extractedText =
        req.file.buffer.toString("utf8");
    } else {
      return res.status(400).json({
        message:
          "Only PDF, DOCX, and TXT files are supported.",
      });
    }

    extractedText =
      extractedText.trim();

    if (!extractedText) {
      return res.status(400).json({
        message:
          "No readable text was found in this file.",
      });
    }

    const uploadsDirectory =
      path.join(
        __dirname,
        "../../uploads"
      );

    if (!fs.existsSync(uploadsDirectory)) {
      fs.mkdirSync(
        uploadsDirectory,
        {
          recursive: true,
        }
      );
    }

    const originalExtension =
      path.extname(
        req.file.originalname
      );

    const safeName = path
      .basename(
        req.file.originalname,
        originalExtension
      )
      .replace(
        /[^a-zA-Z0-9-_]/g,
        "_"
      );

    const storedFileName =
      `${Date.now()}-${safeName}${originalExtension}`;

    const storedFilePath =
      path.join(
        uploadsDirectory,
        storedFileName
      );

    fs.writeFileSync(
      storedFilePath,
      req.file.buffer
    );

    const note = await Note.create({
      userId: req.user.id,

      title,
      subject,
      description:
        description || "",

      pinned:
        pinned === "true" ||
        pinned === true,

      fileName:
        req.file.originalname,

      filePath:
        path.join(
          "uploads",
          storedFileName
        ),

      fileType:
        extension,

      extractedText,
    });

    res.status(201).json(note);
  } catch (err) {
    console.error(
      "NOTE FILE UPLOAD ERROR:",
      err
    );

    res.status(500).json({
      message:
        err.message ||
        "Failed to upload study material.",
    });
  }
};


// =====================================================
// GENERATE AI SUMMARY
// =====================================================

exports.generateNoteSummary = async (
  req,
  res
) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!note) {
      return res.status(404).json({
        message:
          "Note not found.",
      });
    }

    if (!note.extractedText) {
      return res.status(400).json({
        message:
          "This note does not contain uploaded study material.",
      });
    }

    const prompt = `
You are Kortex AI, a college exam revision assistant.

Create a clean, structured revision summary from the study material below.

SUBJECT:
${note.subject}

TITLE:
${note.title}

STUDY MATERIAL:
${note.extractedText}

IMPORTANT RULES:

1. Use ONLY information present in the supplied study material.
2. Never invent facts, examples, statistics, definitions, laws or recommendations.
3. Do not simply copy the document sentence by sentence.
4. Combine repeated ideas into one clear point.
5. Preserve important technical terms and their meanings.
6. Keep the summary concise enough for quick exam revision.
7. Use simple college-level English.
8. Do not include unnecessary introductions or conclusions.
9. Do not mention that you are an AI.
10. Do not say "according to the document".

STRUCTURE THE SUMMARY LIKE THIS:

## Overview
Give a short 2–4 sentence explanation of the main topic.

## Key Concepts
List the most important concepts and explain each briefly.

## Important Definitions
Include important definitions that are explicitly present
or clearly stated in the study material.

## Important Points
Give the important facts, characteristics, principles,
or recommendations as concise bullet points.

## Processes / Steps
If the material contains a process, method or sequence,
present the steps in the correct order.
If there is no process, omit this section.

## Differences
If the material contains comparisons or differences,
present them clearly.
If there are no meaningful comparisons, omit this section.

## Advantages / Disadvantages
Include these only when they are present in the material.

## Exam Important Points
Give the most important points a college student should
remember for an exam.

## Quick Revision
Finish with 5–8 very short bullet points containing
the most important things to remember.

Do not force sections that are not supported by the
study material.
`;

    const completion =
      await groq.chat.completions.create({
        model: AI_MODEL,

        messages: [
          {
            role: "system",
            content:
              "You are Kortex AI, a reliable college study assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.3,
        top_p: 0.9,
        max_completion_tokens: 2048,
      });

    const summary =
      completion.choices?.[0]?.message?.content?.trim();

    if (!summary) {
      throw new Error(
        "AI returned an empty summary."
      );
    }

    note.aiSummary =
      summary;

    await note.save();

    return res.status(200).json({
      message:
        "Note summary generated successfully.",

      summary:
        note.aiSummary,

      note,
    });
  } catch (error) {
    console.error(
      "NOTE SUMMARY ERROR:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to generate note summary.",
    });
  }
};


// =====================================================
// GENERATE 2-MARK QUESTIONS
// =====================================================

exports.generateTwoMarkQuestions = async (
  req,
  res
) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!note) {
      return res.status(404).json({
        message:
          "Note not found.",
      });
    }

    if (!note.extractedText) {
      return res.status(400).json({
        message:
          "This note does not contain uploaded study material.",
      });
    }

    const prompt = `
You are Kortex AI, a college exam preparation assistant.

Generate important 2-mark questions from the study material below.

SUBJECT:
${note.subject}

TITLE:
${note.title}

STUDY MATERIAL:
${note.extractedText}

RULES:
- Generate exactly 10 questions.
- Questions must be answerable from the supplied material.
- Do not invent information.
- Questions should be suitable for college 2-mark examinations.
- Prefer definitions, differences, short explanations, key concepts,
  characteristics, advantages, disadvantages, steps and important facts.
- Each answer should be short and suitable for a 2-mark answer.
- Avoid duplicate questions.
- Return ONLY valid JSON.
- Do not use markdown.

FORMAT:
[
  {
    "question": "Question here",
    "answer": "Short 2-mark answer here"
  }
]
`;

    const completion =
      await groq.chat.completions.create({
        model: AI_MODEL,

        messages: [
          {
            role: "system",
            content:
              "You are Kortex AI, an accurate college exam preparation assistant. Return valid JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.5,
        top_p: 0.9,
        max_completion_tokens: 4096,
      });

    let aiResponse =
      completion.choices?.[0]?.message?.content ||
      "";

    aiResponse =
      aiResponse
        .replace(
          /```json/gi,
          ""
        )
        .replace(
          /```/g,
          ""
        )
        .trim();

    const startIndex =
      aiResponse.indexOf("[");

    const endIndex =
      aiResponse.lastIndexOf("]");

    if (
      startIndex === -1 ||
      endIndex === -1
    ) {
      throw new Error(
        "AI did not return valid question data."
      );
    }

    const jsonText =
      aiResponse.substring(
        startIndex,
        endIndex + 1
      );

    let questions;

    try {
      questions =
        JSON.parse(
          jsonrepair(jsonText)
        );
    } catch (error) {
      console.error(
        "NOTE QUESTIONS JSON ERROR:",
        error
      );

      throw new Error(
        "AI returned invalid question data."
      );
    }

    if (!Array.isArray(questions)) {
      throw new Error(
        "AI questions response is not an array."
      );
    }

    const cleanedQuestions =
      questions
        .slice(0, 10)
        .map((item) => ({
          question:
            String(
              item?.question || ""
            ).trim(),

          answer:
            String(
              item?.answer || ""
            ).trim(),
        }))
        .filter(
          (item) =>
            item.question &&
            item.answer
        );

    if (
      cleanedQuestions.length === 0
    ) {
      throw new Error(
        "No valid 2-mark questions were generated."
      );
    }

    note.twoMarkQuestions =
      cleanedQuestions;

    await note.save();

    return res.status(200).json({
      message:
        "2-mark questions generated successfully.",

      questions:
        note.twoMarkQuestions,

      note,
    });
  } catch (error) {
    console.error(
      "NOTE 2-MARK QUESTIONS ERROR:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to generate 2-mark questions.",
    });
  }
};


// =====================================================
// GENERATE QUIZ FROM UPLOADED STUDY MATERIAL
// =====================================================

exports.generateNoteQuiz = async (
  req,
  res
) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!note) {
      return res.status(404).json({
        message:
          "Note not found.",
      });
    }

    if (!note.extractedText) {
      return res.status(400).json({
        message:
          "This study material does not contain readable text.",
      });
    }

    const requestedCount =
      Number(req.body.count) || 10;

    const questionCount =
      Math.min(
        Math.max(
          requestedCount,
          5
        ),
        20
      );

    const difficulty =
      cleanText(
        req.body.difficulty
      ) || "Medium";

    const prompt = `
You are Kortex AI, a college exam quiz generator.

Generate exactly ${questionCount} multiple-choice questions
from the supplied study material.

SUBJECT:
${note.subject}

TITLE:
${note.title}

DIFFICULTY:
${difficulty}

STUDY MATERIAL:
${note.extractedText}

IMPORTANT RULES:

1. Use ONLY information contained in the study material.
2. Do not invent facts, examples, statistics, definitions,
   concepts, terminology or explanations.
3. Every question must be directly answerable from the material.
4. Generate exactly ${questionCount} questions.
5. Each question must have exactly four options.
6. Only one option must be correct.
7. The correct answer must exactly match one of the four options.
8. Include a short explanation for the correct answer.
9. Questions should test understanding, not merely copy sentences.
10. Avoid duplicate or nearly identical questions.
11. Cover different important concepts from the material.
12. Prefer college-level exam questions.
13. Use a mixture of:
    - definitions
    - concepts
    - characteristics
    - comparisons
    - processes
    - applications explicitly present in the material
    - important facts
14. Do not ask questions about information that is not present
    in the study material.
15. Do not mention that you are an AI.
16. Do not include markdown.
17. Return ONLY valid JSON.

RETURN EXACTLY THIS FORMAT:

[
  {
    "question": "Question text",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "answer": "Option A",
    "explanation": "Short explanation based only on the study material."
  }
]
`;

    const completion =
      await groq.chat.completions.create({
        model: AI_MODEL,

        messages: [
          {
            role: "system",
            content:
              "You are Kortex AI, a reliable college quiz generator. Use only the supplied study material and return valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.6,
        top_p: 0.9,
        max_completion_tokens: 4096,
      });

    let aiResponse =
      completion.choices?.[0]?.message?.content ||
      "";

    aiResponse =
      aiResponse
        .replace(
          /```json/gi,
          ""
        )
        .replace(
          /```/g,
          ""
        )
        .trim();

    const startIndex =
      aiResponse.indexOf("[");

    const endIndex =
      aiResponse.lastIndexOf("]");

    if (
      startIndex === -1 ||
      endIndex === -1
    ) {
      throw new Error(
        "AI did not return valid quiz data."
      );
    }

    const jsonText =
      aiResponse.substring(
        startIndex,
        endIndex + 1
      );

    let quiz;

    try {
      quiz =
        JSON.parse(
          jsonrepair(jsonText)
        );
    } catch (error) {
      console.error(
        "NOTE QUIZ JSON ERROR:",
        error
      );

      throw new Error(
        "AI returned invalid quiz data."
      );
    }

    if (!Array.isArray(quiz)) {
      throw new Error(
        "AI quiz response is not an array."
      );
    }

    const cleanedQuiz =
      quiz
        .slice(0, questionCount)
        .map((question) => {
          const options =
            Array.isArray(
              question?.options
            )
              ? question.options
                  .map((option) =>
                    cleanText(option)
                  )
                  .filter(Boolean)
                  .slice(0, 4)
              : [];

          const answer =
            cleanText(
              question?.answer
            );

          return {
            question:
              cleanText(
                question?.question
              ),

            options,

            answer,

            explanation:
              cleanText(
                question?.explanation
              ) ||
              "Explanation unavailable.",
          };
        })
        .filter(
          (question) =>
            question.question &&
            question.options.length === 4 &&
            question.options.includes(
              question.answer
            )
        );

    if (
      cleanedQuiz.length === 0
    ) {
      throw new Error(
        "No valid quiz questions were generated."
      );
    }

    // Find the user's actual Subject document.
const subject = await Subject.findOne({
  userId: req.user.id,
  name: {
    $regex: `^${String(note.subject || "").trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
    $options: "i",
  },
});

    if (!subject) {
      return res.status(400).json({
        message:
          "The subject linked to this study material could not be found. Please check the subject name.",
      });
    }

    return res.status(200).json({
      message:
        "Quiz generated successfully from study material.",

      quiz:
        cleanedQuiz,

      source: {
        type: "note",
        noteId:
          note._id,
        title:
          note.title,
        fileName:
          note.fileName,
        subjectId:
          subject._id,
        subjectName:
          subject.name,
      },
    });
  } catch (error) {
    console.error(
      "GENERATE NOTE QUIZ ERROR:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to generate quiz from study material.",
    });
  }
};