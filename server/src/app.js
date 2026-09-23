const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const plannerRoutes = require("./routes/plannerRoutes");
const aiRoutes=require("./routes/aiRoutes");
const calendarRoutes = require("./routes/calendarRoutes");
const noteRoutes=require("./routes/noteRoutes");
const attendanceRoutes=require("./routes/attendanceRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const quizRoutes = require("./routes/quizRoutes");

const app = express();


// Middlewares

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended:true
}));

// Routes

app.use(
    "/api/auth",
    authRoutes
);

app.use(
"/api/ai",
aiRoutes
);

app.use(
    "/api/planner",
    plannerRoutes
);

app.use(
    "/api/user",
    userRoutes
);

app.use(
    "/api/subjects",
    subjectRoutes
);

app.use("/api/notes",noteRoutes);

app.use("/api/calendar", calendarRoutes);
// Default route

app.use(
"/api/attendance",
attendanceRoutes
);

app.use("/api/analytics", analyticsRoutes);
app.use("/api/quiz", quizRoutes);

app.get("/", (req, res) => {

    res.send(
        "Kortex AI Backend Running 🚀"
    );

});


module.exports = app;